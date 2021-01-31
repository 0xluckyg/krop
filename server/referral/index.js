const {Coupon} = require('../db/coupon');
const {Referral} = require('../db/referral')
const shortid = require("shortid")
const {compileCoupon} = require('./compiler')
const keys = require('../../config/keys')

async function deleteReferralCoupon(options) {
    const {campaignId, id} = options
    await Coupon.deleteOne({campaignId, couponId: id})   
}

async function createReferralCoupon(options) {
    const {accountId, id, campaignId, couponExpiration} = options
    coupon = compileCoupon(options)
    const coupon = new Coupon({
        ...coupon,
        accountId,
        couponId: id,
        campaignId,
        expiration: couponExpiration
    })
    await coupon.save()
}


async function sendReferralCoupon(ctx) {
    let body = JSON.parse(ctx.request.rawBody) 
    const {clientId, sessionId, campaignId, accountId, id} = body

    const referralId = shortid.generate()
    await Referral.save({
        clientId, sessionId, campaignId, accountId, couponId: id,
        referralId,
        domain
    })

    ctx.body = `${process.env.APP_URL}/coupon/${referralId}`
}

function getCouponDevParams(ctx) {
    return {...ctx.query}
}

function getCouponProductionParams(ctx) {
    const blacklistedSubdomains = ['www']
    let referralId;
    let domain;
    if (ctx.request.header && ctx.request.header.host) {
        let domainSplit = ctx.request.header.host.split('.')
        if (domainSplit) {
            domain = domainSplit[0]
            if (domain && !blacklistedSubdomains.includes(domain)) {
                let urlSplit = ctx.request.url.split("/")
                if (!urlSplit || urlSplit[0] != 'coupon') return false
                referralId = urlSplit[urlSplit.length - 1]
            } else {
                return false
            }
        }
    }

    return {domain, referralId}
}

function formatDate(expiration) {
    const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
    let date = new Date(Date.parse(ISO))
    date.setTime( date.getTime() + expiration * 86400000 );
    return `${date.getFullYear()}, ${months[date.getMonth()]}/${date.getDate()}`
}

async function getReferralCoupon(ctx) {
    let couponParams
    if (process.env.NODE_ENV == 'development') {
        couponParams = getCouponDevParams(ctx)
    } else {
        couponParams = getCouponProductionParams(ctx)
    }
    if (!couponParams || !couponParams.domain) {
        return await next()
    }

    const referral = await Referral.findOneAndUpdate(couponParams, {
        $inc: {views: 1}
    }, {new: true})
    if (!referral) {
        return await next()
    }
    const {domain, couponId, expiration} = referral

    const coupon = await Coupon.findOneAndUpdate({domain, couponId}, {
        $inc: {views: 1}
    }, {new: true})
    if (!coupon) {
        return await next()
    }

    let {html, css} = coupon
    html = html.replace(`{{${keys.EXPIRATION_DATE}}}`, formatDate(expiration))

    ctx.body = `<html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${keys.APP_NAME}</title>
            <meta name="host" content="Krop">
            <script type="text/javascript" async></script>
            <style>${css}</style>
        </head>
        ${html}
    </html>`
}

module.exports = {
    createReferralCoupon,
    deleteReferralCoupon,
    sendReferralCoupon,
    getReferralCoupon
}