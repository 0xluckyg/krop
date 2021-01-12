const URL = require('url');
const uglifier = require("uglify-js");
const fs = require('fs').promises;
const mongoose = require('mongoose');

const keys = require('../../config/keys')
const {Survey} = require('../db/survey')
const {User} = require('../db/user')
const {needsPaymentUpgradeForMoreViews, handlePaymentUpgradeEmail} = require('../payment/payment')

async function incrementSurveyView(domain) {
    await Survey.update({
        domain,
        expiresAt: null,
        enabled: true
    }, {
        $inc: { views: 1 } 
    })
}

//TODO: TEST THIS
async function incrementTotalView(domain) {
    const user = await User.findOne({domain})
    if (!user) return
    const lastUpdated = user.views ? new Date(user.views.updatedAt).getMonth() : undefined
    const thisMonth = new Date().getMonth()
    
    let views = 0
    if (lastUpdated && lastUpdated <= thisMonth ) {
        let count = (!user.views || !user.views.count) ? 0 : user.views.count
        views = Number(count) + 1
    }
    
    return await User.findOneAndUpdate({domain}, {
        views: {
            count: views,
            updatedAt: new Date()
        }
    }, {new: 1})
}


function minifyJS(script) {
    try {
        const options = { toplevel: true }
        const result = uglifier.minify(script, options);
        return result.code   
    } catch(err) {
        console.log("failed minifyJS: ", err)
    }
}

function parseToday() {
    let today = new Date()
    const dayString = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    today = `${today.getMonth() + 1}${dayString}`
    return Number(today)
}

async function getSurvey(domain, path) {
    path = path ? path : ''
    const today = parseToday()
    const thisYear = new Date().getFullYear()
    const user = await User.findOne({domain})
    const survey = await Survey.findOne({
        accountId: user._id,
        path,
        expiresAt: null,
        enabled: true
    }, {stages: 0}, ).sort({'updatedAt':-1}).or([{ 
        'settings.schedule.from': { $lte: today },  
        'settings.schedule.to': { $gte: today },
        'settings.schedule.fromYear': { $lte: thisYear },
        'settings.schedule.toYear': { $gte: thisYear },
    }, { 
        'settings.schedule.fromOverflow': { $lte: today },  
        'settings.schedule.toOverflow': { $gte: today },
        'settings.schedule.fromYear': { $lte: thisYear },
        'settings.schedule.toYear': { $gte: thisYear },
    }])
    
    return {
        accountId: user._id,
        surveyId: survey._id,
        surveyName: survey.settings.name,
        alertMessages: survey.alertMessages,
        ...survey.compiled
    }
}

function getSurveyDevParams(ctx) {
    const ctxHeader = ctx.request
    const url = ctxHeader.origin.replace(/(^\w+:|^)\/\//, '')
    return {url, ...ctx.query}
}

function getSurveyProductionParams(ctx) {
    const ctxHeader = ctx.request.header
    const url = ctxHeader.origin.replace(/(^\w+:|^)\/\//, '')
    return {url, domain: '', path: ''}
}

//MAIN
async function getSurveyScript(ctx) {
    try {
        let script = await fs.readFile(`${__dirname}/script.js`, "utf8");
        let surveyParams
        if (process.env.NODE_ENV == 'development') {
            surveyParams = getSurveyDevParams(ctx)
        } else {
            surveyParams = getSurveyProductionParams(ctx)
        }
        const {domain, path} = surveyParams
        
        const user = await incrementTotalView(domain)
        if (!user) return
        // const needsUpgrade = needsPaymentUpgradeForMoreViews(user, user.views.count)
        // if (needsUpgrade) {
        //     await handlePaymentUpgradeEmail(ctx, user)
        // } else {
        
        script = script.replace('{{APP_URL}}', process.env.APP_URL)
        script = script.replace('{{APP_NAME}}', keys.APP_NAME)
        script = script.replace('{{DOMAIN}}', domain)
        script = script.replace('{{PATH}}', path)
        
        script = minifyJS(script)

        ctx.body = `
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${keys.APP_NAME}</title>
            <meta name="host" content="Krop">
            <script type="text/javascript" async>${script}</script>
        </head>
        <body>
        </body>
        </html>`
    
    } catch (err) {
        console.log('Failed getWidgetScript: ', err)
    }
}

async function getSurveyOptions(ctx) {
    try {
        const {domain, path} = JSON.parse(ctx.request.rawBody)
        const survey = await getSurvey(domain, path)
        ctx.body = {
            ...survey,
            clientId: mongoose.Types.ObjectId(),
            sessionId: mongoose.Types.ObjectId()
        }
        
        await incrementSurveyView(domain, path)
    } catch (err) {
        console.log('Failed getSurveyScript: ', err)
    }
}

module.exports = {getSurveyScript, getSurveyOptions}