// See your keys here: https://dashboard.stripe.com/account/apikeys
// STRIPE PRODUCT API
// https://stripe.com/docs/api/products
// STRIPE PRICE API
// https://stripe.com/docs/api/prices
const {createEmailTemplate, sendEmail} = require('../communication/email')

const stripe = require('stripe')(
    process.env.NODE_ENV == 'development' ? 
    process.env.STRIPE_API_TEST_SECRET_KEY :
    process.env.STRIPE_API_SECRET_KEY
)
const {User} = require('../db/user')

function getStripePrices() {
    return new Promise((resolve, reject) => {
        stripe.prices.list(
            {limit: 50},
            function(err, prices) {
                if (err) return reject(err)
                resolve(prices.data)
            }
        );  
    })
}

function createStripeProduct() {
    return new Promise((resolve, reject) => {
        stripe.products.create(
            {name: 'Vivelop Custom'},
            function(err, product) {
                if (err) return reject(err)
                resolve(product)
            }
        );
    })
}

function createStripePrice(product, price) {
    return new Promise((resolve, reject) => {
        stripe.prices.create(
            {
                unit_amount: Number(price) * 100,
                currency: 'usd',
                recurring: {interval: 'month'},
                product: product.id
            },
            function(err, product) {
                if (err) return reject(err)
                resolve(product)
            }
        );
    })
}

async function createNewStripePaymentOption(price) {
    const product = await createStripeProduct()
    const newPrice = await createStripePrice(product, price)
    return newPrice.id
}

async function getPriceId(plan) {
    const prices = await getStripePrices()
    let priceId = false
    prices.map(price => {
        if (Number(price['unit_amount']) == Number(plan) * 100) {
            priceId = price.id
        }
    })
    
    if (!priceId) {
        priceId = await createNewStripePaymentOption(plan)
    }
    
    return priceId
}

async function createStripeSession(ctx) {
    let {plan} = ctx.query
    const {accessToken} = ctx.session
    const priceId = await getPriceId(plan)
    const user = await User.findOne({accessToken}, {_id: 1})
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: priceId,
            quantity: 1
        }],
        mode: 'subscription',
        success_url: `${process.env.APP_URL}/payment/success`,
        cancel_url: `${process.env.APP_URL}/home`,
        client_reference_id: JSON.stringify({id: user._id, plan})
    });
    
    await User.findOneAndUpdate({accessToken}, {
        'payment.customerId': session.client_reference_id
    })
    
    ctx.body = session
}

async function updateStripeSubscription(ctx, user) {
    try {
        const {accessToken} = ctx.session
        const {plan} = ctx.query
        
        const subscriptionId = user.payment.subscriptionId
        const priceId = await getPriceId(plan)
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [{
                id: subscription.items.data[0].id,
                price: priceId,
            }]
        });
        
        await User.findOneAndUpdate({accessToken}, {
            $set: {
                payment: {
                    plan,
                    subscriptionId,
                    accepted: true,
                    date: new Date()
                },
                branding: {
                    enabled: !(Number(plan) > 0)
                }
            }
        }, {new: true})
        
        const subscriptionChangeNotificationEmail = await createEmailTemplate({
            headerText: `Your subscription plan has been changed!`,
            bodyText: `Your payment plan has been successfully changed. Thank you for being with us.`,
            buttonLink: process.env.APP_URL,
            buttonText: 'Go Back To App'
        })
        
        await sendEmail({
            to: user.email,
            subject: 'Vivelop Subscription Changed!',
            html: subscriptionChangeNotificationEmail
        })
        
        ctx.body = 'updated'
    } catch(err) {
        console.log("Failed subscription update: ", err)
    }
}

async function handleStripeSubscription(ctx) {
    const {accessToken} = ctx.session
    if (!ctx.query.plan) {
        ctx.status = 400
        return
    }
    
    const user = await User.findOne({accessToken})
    if (user.payment.subscriptionId) {
        await updateStripeSubscription(ctx, user)
    } else {
        await createStripeSession(ctx)
    }
}

// to test
// stripe listen --forward-to vivelop.ngrok.io/webhooks/stripe-webhook
// Ready! Your webhook signing secret is '{{WEBHOOK_SIGNING_SECRET}}'
// test with 4242 4242 4242 4242
async function handleStripeWebhook(ctx) {
    let body = ctx.request.rawBody
    const sig = ctx.request.headers['stripe-signature'];
    let event;
    
    try {
        const stripeWebhookKey = process.env.NODE_ENV == 'development' ?
        process.env.STRIPE_TEST_WEBHOOK_KEY : process.env.STRIPE_WEBHOOK_KEY
        event = stripe.webhooks.constructEvent(body, sig, stripeWebhookKey);
    } catch (err) {
        console.log('Failed handleStripeWebhook', err.message)
        return ctx.body = `Webhook Error: ${err.message}`
    }
    
    if (event.type === 'charge.succeeded') {
        const {receipt_url, billing_details} = event.data.object;
        if (!billing_details.email) return ctx.status = 200
        
        const receiptEmail = await createEmailTemplate({
            headerText: `Subscription Success!`,
            bodyText: `Your subscription change has been successful! Thank you for using our service`,
            buttonLink: receipt_url,
            buttonText: 'View Receipt'
        })
        
        await sendEmail({
            to: billing_details.email,
            subject: "Vivelop subscription success! Here's your receipt",
            html: receiptEmail
        })
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const {client_reference_id, subscription} = event.data.object;
        const {id, plan} = JSON.parse(client_reference_id)
        await User.findOneAndUpdate({_id: id}, {
            $set: {
                payment: {
                    plan,
                    subscriptionId: subscription,
                    accepted: true,
                    date: new Date()
                }
            }
        })
    }
    
    ctx.status = 200
}

module.exports = {createStripeSession, handleStripeSubscription, handleStripeWebhook}