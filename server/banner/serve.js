const URL = require('url');
const uglifier = require("uglify-js");
const fs = require('fs').promises;
const mongoose = require('mongoose');

const keys = require('../../config/keys')
const {Banner} = require('../db/banners')
const {needsPaymentUpgradeForMoreViews, handlePaymentUpgradeEmail} = require('../payment/payment')

function minifyJS(script) {
    const options = { toplevel: true }
    const result = uglifier.minify(script, options);
    return result.code
}

async function getBanner(url, id, referer) {
    const thisYear = new Date().getFullYear()
    const banners = await Banner.find({
        accountId: id,
        domain: url,
        enabled: true
    })
    let banner = banners ? banners[0] : {}
    return banner
}

//MAIN
async function getBannerScript(ctx) {
    try {
        let script = await fs.readFile(`${__dirname}/script.js`, "utf8");

        if (!user) return
        const needsUpgrade = needsPaymentUpgradeForMoreViews(user, user.views.count)
        if (needsUpgrade) {
            await handlePaymentUpgradeEmail(ctx, user)
        } else {
            script = script.replace('{{APP_URL}}', process.env.APP_URL)
            script = script.replace('{{APP_NAME}}', keys.APP_NAME)
            script = script.replace('{{ACCOUNT_ID}}', ctx.query.key)
            script = minifyJS(script)
            ctx.body = script   
        }
        
    } catch (err) {
        console.log('Failed getBannerScript: ', err)
    }
}

async function getBannerOptions(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)
        
        const ctxHeader = ctx.request.header
        const url = ctxHeader.origin.replace(/(^\w+:|^)\/\//, '')
        if (!ctxHeader) {
            ctx.status = 404
            return
        }
        
        let banners = []
        banners = await getBanner(url, body.accountId, ctxHeader.referer)

        ctx.body = {
            banners,
            clientId: mongoose.Types.ObjectId(),
            sessionId: mongoose.Types.ObjectId()
        }
        
    } catch (err) {
        console.log('Failed getBannerScript: ', err)
    }
}

module.exports = {getBannerScript, getBannerOptions}