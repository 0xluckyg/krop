const URL = require('url');
const uglifier = require("uglify-js");
const fs = require('fs').promises;
const mongoose = require('mongoose');

const keys = require('../../config/keys')
const {Campaign} = require('../db/campaign')
const {User} = require('../db/user')
const {needsPaymentUpgradeForMoreViews, handlePaymentUpgradeEmail} = require('../payment/payment')

async function incrementCampaignView(domain) {
    await Campaign.update({
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

async function getCampaign(domain, path) {
    path = path ? path : ''
    const today = parseToday()
    const thisYear = new Date().getFullYear()
    const user = await User.findOne({domain})
    const campaign = await Campaign.findOne({
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
        campaignId: campaign._id,
        campaignName: campaign.settings.name,
        alertMessages: campaign.alertMessages,
        ...campaign.compiled
    }
}

function getCampaignDevParams(ctx) {
    return {...ctx.query}
}

function getCampaignProductionParams(ctx) {
    const blacklistedSubdomains = ['www']
    let path;
    let domain;
    if (ctx.request.header && ctx.request.header.host) {
        let domainSplit = ctx.request.header.host.split('.')
        if (domainSplit) {
            domain = domainSplit[0]
            if (domain && !blacklistedSubdomains.includes(domain)) {
                path = ctx.request.url.replace("/", "")
            } else {
                return false
            }
        }
    }

    return {domain, path}
}

//MAIN
async function getCampaignScript(ctx, next) {
    try {
        let campaignParams
        if (process.env.NODE_ENV == 'development') {
            campaignParams = getCampaignDevParams(ctx)
        } else {
            campaignParams = getCampaignProductionParams(ctx)
        }
        if (!campaignParams) {
            return await next()
        }
        const {domain, path} = campaignParams
        if (!domain) {
            return await next()
        }
        const user = await incrementTotalView(domain)
        if (!user) {
            return await next()
        }

        let script = await fs.readFile(`${__dirname}/script.js`, "utf8");
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

async function getCampaignOptions(ctx) {
    try {
        const {domain, path} = JSON.parse(ctx.request.rawBody)
        const campaign = await getCampaign(domain, path)
        ctx.body = {
            ...campaign,
            clientId: mongoose.Types.ObjectId(),
            sessionId: mongoose.Types.ObjectId()
        }
        
        await incrementCampaignView(domain, path)
    } catch (err) {
        console.log('Failed getCampaignScript: ', err)
    }
}

module.exports = {getCampaignScript, getCampaignOptions}