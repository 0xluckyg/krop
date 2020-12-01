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
async function incrementTotalView(ctx) {
    const query = ctx.query
    const user = await User.findOne({_id: query.key})
    if (!user) return
    const lastUpdated = user.views ? new Date(user.views.updatedAt).getMonth() : undefined
    const thisMonth = new Date().getMonth()
    
    let views = 0
    if (lastUpdated && lastUpdated <= thisMonth ) {
        let count = (!user.views || !user.views.count) ? 0 : user.views.count
        views = Number(count) + 1
    }
    
    return await User.findOneAndUpdate({_id: query.key}, {
        views: {
            count: views,
            updatedAt: new Date()
        }
    }, {new: 1})
}


function minifyJS(script) {
    const options = { toplevel: true }
    const result = uglifier.minify(script, options);
    return result.code
}

function parseToday() {
    let today = new Date()
    const dayString = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    today = `${today.getMonth() + 1}${dayString}`
    return Number(today)
}

async function getSurvey(url, id, referer) {
    
    const today = parseToday()
    const thisYear = new Date().getFullYear()
    const survey = await Survey.findOne({
        accountId: id,
        domain: url,
        //don't fetch preview
        expiresAt: null,
        enabled: true
    }, {stages: 0, fixed: 0}).or([{ 
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
    
    return survey
}


//MAIN
async function getSurveyScript(ctx) {
    try {
        // let script = await fs.readFile(`${__dirname}/script.js`, "utf8");

        // const user = await incrementTotalView(ctx)
        // if (!user) return
        // const needsUpgrade = needsPaymentUpgradeForMoreViews(user, user.views.count)
        // if (needsUpgrade) {
        //     await handlePaymentUpgradeEmail(ctx, user)
        // } else {
            // script = script.replace('{{APP_URL}}', process.env.APP_URL)
            // script = script.replace('{{APP_NAME}}', keys.APP_NAME)
            // script = minifyJS(script)
            ctx.body = '<h1>FUCK YES</h1>'
        // }
        
    } catch (err) {
        console.log('Failed getWidgetScript: ', err)
    }
}

async function getSurveyOptions(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)
        
        const ctxHeader = ctx.request.header
        const url = ctxHeader.origin.replace(/(^\w+:|^)\/\//, '')
        if (!ctxHeader) {
            ctx.status = 404
            return
        }
        
        const survey = await getSurvey(url, body.accountId, ctxHeader.referer)

        ctx.body = {
            survey,
            clientId: mongoose.Types.ObjectId(),
            sessionId: mongoose.Types.ObjectId()
        }
        
        await incrementSurveyView(url)
    } catch (err) {
        console.log('Failed getSurveyScript: ', err)
    }
}

module.exports = {getSurveyScript, getSurveyOptions}