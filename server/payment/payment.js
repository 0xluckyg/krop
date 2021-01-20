const {User} = require('../db/user');
const keys = require('../../config/keys')
const {createEmailTemplate, sendEmail} = require('../communication/email')

function needsPaymentUpgradeForMoreViews(user, views) {
    if (!user) return false
    let plan = user.payment.plan
    if (plan > 0 && !plan) return true
    plan = Number(plan)
    //if lowest plan
    if (plan < keys.FEE_1.price) {
        return (views > keys.FEE_0.views)
    //if plan 1
    } else if (plan >= keys.FEE_1.price && plan < keys.FEE_2.price) {
        return (views > keys.FEE_1.views)
    //if plan 2
    } else if (plan >= keys.FEE_2.price && plan < keys.FEE_3.price) {
        return (views > keys.FEE_2.views)
    //if highest plan
    } else {
        false
    } 
}

//Shopify does not keep track of how many free trial days are left after app uninstalled.
function calculateTrialDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are javascript Date objects
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    const dayDifference = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return (keys.FREE_TRIAL - dayDifference <= 0) ? 0 : (keys.FREE_TRIAL - dayDifference)
}

async function saveAcceptPayment(accessToken, price, date) {
    date = date ? new Date(date) : new Date()
    const accepted = (price > 0) ? true : false
    await User.findOneAndUpdate(
        { accessToken }, 
        { $set: { 
                payment: {
                    accepted,
                    plan: price,
                    date
                },
                branding: {
                    enabled: !accepted
                }
            }
        }
    )
    .catch(err => {
        console.log('Failed saving accepted payment', err)
    })
}

async function handlePaymentUpgradeEmail(ctx, user) {
    try {
        if (!user) return
        const plan = user.payment.plan
        
        const appUrl = process.env.APP_URL
        const planUpgradeEmail = await createEmailTemplate({
            headerText: `Please upgrade your plan, ${user.name}!`,
            bodyText: `You've reached our per month page view quota at ${plan.views} visits. Your clients will see our widgets again as soon as you upgrade the subscription.`,
            buttonLink: appUrl + '/subscription',
            buttonText: 'Upgrade Now!'
        })
        
        await sendEmail({
            to: user.email,
            subject: 'URGENT! Please upgrade your plan at krop.app',
            html: planUpgradeEmail
        })
        
        ctx.body = 'success'
    } catch (err) {
        console.log('Failed send handlePaymentUpgradeEmail email: ', err)
    }
}

module.exports = {needsPaymentUpgradeForMoreViews, calculateTrialDays, saveAcceptPayment, handlePaymentUpgradeEmail};