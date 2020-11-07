const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const keys = require('../../config/keys')

async function createEmailTemplate(options) {
    const {headerText, bodyText, buttonLink, buttonText} = options
    const appUrl = process.env.APP_URL
    let emailScript = await fs.readFile(`${__dirname}/email-template.html`, "utf8");
    emailScript = emailScript.replace(/{{APP_COLOR}}/g, keys.APP_COLOR)
    emailScript = emailScript.replace(/{{APP_LOGO}}/g, appUrl+'/static/app/logo.svg')
    
    emailScript = emailScript.replace(/{{HEADER_TEXT}}/g, headerText ? headerText : 'Vivelop Popup Editor')
    emailScript = emailScript.replace(/{{BODY_TEXT}}/g, bodyText ? bodyText : 'Check out our app!')
    emailScript = emailScript.replace(/{{BUTTON_LINK}}/g, buttonLink ? buttonLink : appUrl)
    emailScript = emailScript.replace(/{{BUTTON_TEXT}}/g, buttonText ? buttonText : 'GO')
    
    emailScript = emailScript.replace(/{{SENDER_NAME}}/g, 'Vivelop')
    emailScript = emailScript.replace(/{{SENDER_ADDRESS}}/g, keys.APP_ADDRESS)
    emailScript = emailScript.replace(/{{SENDER_CITY}}/g, keys.APP_CITY)
    emailScript = emailScript.replace(/{{SENDER_STATE}}/g, keys.APP_STATE)
    emailScript = emailScript.replace(/{{SENDER_ZIP}}/g, keys.APP_ZIP)
    emailScript = emailScript.replace(/{{UNSUBSCRIBE}}/g, appUrl)
    
    return emailScript
}

function sendEmail(options) {
    try {
        const {to, subject, html} = options
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to,
            from: process.env.APP_EMAIL,
            subject,
            html
        };
        
        return new Promise((resolve,reject) => {
            sgMail.send(msg).then((res) => {
                resolve()
            }).catch(err => {
                if (err) {
                    reject(err)
                    console.log('Failed to send email using Sendgrid: ', err)
                }
            });   
        })
    } catch (err) {
        console.log('Failed sendEmail: ', err)
    }
}

module.exports = {
    createEmailTemplate,
    sendEmail
}