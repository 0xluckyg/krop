const sgMail = require('@sendgrid/mail');

async function contactUs(ctx) {
    
    try {
        const shop = ctx.session.shop       
        const body = JSON.parse(ctx.request.rawBody)
    
        //Adds the shop domain as part of the body text to identify which store the message was sent from
        const bodyText = 'Shop: ' + shop + '\n\n' + 'App: ' + process.env.APP_URL + '\n\n' + body.body
    
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: process.env.APP_EMAIL,
            from: body.email,
            subject: body.subject,
            text: bodyText,
        };
        sgMail.send(msg).catch(err => {
            if (err) console.log('Failed to send contactUs email using Sendgrid: ', err)
        });
        ctx.body = 'success'
    } catch(err) {
        console.log('Failed to send contactUs email: ', err)
        ctx.status = 400   
    }
}

//contact us on landing page. Uses recaptcha on the frontend, and can be accessed without loggin into the app
async function contactUsUnauthorized(ctx) {    
    try {
        const body = JSON.parse(ctx.request.rawBody)

        const bodyText = 'Name: ' + body.name + '\n\n'  + 'App: ' + process.env.APP_URL + '\n\n' + body.body

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: process.env.APP_EMAIL,
            from: body.email,
            subject: body.subject,
            text: bodyText,
        };
        sgMail.send(msg).catch(err => {
            if (err) console.log('Failed to send contactUs email using Sendgrid: ', err)
        });
        ctx.body = 'success'

    } catch (err) {
        console.log('Failed send contactUsUnauthorized email: ', err)
    }
}

module.exports = {contactUs, contactUsUnauthorized}