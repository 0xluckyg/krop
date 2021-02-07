const {Coupon} = require('../db/coupon');
const {Referral} = require('../db/referral')
const {User} = require('../db/user')
const shortid = require("shortid")
const {compileCoupon} = require('./compiler')
const keys = require('../../config/keys');

let strings = {
    en:{
        expirationLabel: "Valid until: "
    },
    kr: {
        expirationLabel: "유효기간: "
    }
}
strings = {...strings[process.env.LANGUAGE]}

async function updateReferralCoupon(options) {
    const {campaignId, accountId} = options
    let referralElement
    options.stages.map((stage) => {
        stage.elements.map((element) => {
            if (element.type == keys.REFERRAL_ELEMENT) {
                referralElement = element
            }
        })
    })
    if (!referralElement) return
    await deleteReferralCoupon({...referralElement, campaignId, accountId})
    await createReferralCoupon({...referralElement, campaignId, accountId})
}

async function deleteReferralCoupon(options) {
    const {campaignId, id} = options
    await Coupon.deleteOne({campaignId, couponId: id})   
}

async function createReferralCoupon(options) {
    const {accountId, id, campaignId, couponExpiration, coordinates} = options
    let user = await User.findOne({_id: accountId})
    compiledCoupon = compileCoupon(options)
    const coupon = new Coupon({
        ...compiledCoupon,
        accountId,
        couponId: id,
        campaignId,
        domain: user.domain,
        expiration: couponExpiration,
        coordinates
    })
    await coupon.save()
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
                if (!urlSplit || urlSplit[1] != 'coupon') return false
                let referralString = urlSplit[urlSplit.length - 1]
                referralId = referralString.split('?')[0]
            } else {
                return false
            }
        }
    }

    return {domain, referralId}
}

function getDevReferralUrl(domain, referralId) {
    return `${process.env.APP_URL}/coupon/example?domain=${domain}&referralId=${referralId}`
}

function getProductionReferralUrl(domain, referralId) {
    let originalUrl = process.env.APP_URL
    originalUrl = originalUrl.replace("www.", domain+".")
    return `${originalUrl}/coupon/${referralId}`
}

async function sendReferralCoupon(ctx) {
    let body = JSON.parse(ctx.request.rawBody) 
    const {clientId, sessionId, campaignId, accountId, couponId, domain} = body

    const referralId = shortid.generate()
    const referral = new Referral({
        clientId, sessionId, campaignId, accountId, couponId,
        referralId,
        domain
    })
    await referral.save()

    let url = process.env.NODE_ENV == 'development' ? 
    getDevReferralUrl(domain ,referralId) : 
    getProductionReferralUrl(domain, referralId)

    ctx.body = {
        url
    }
}

function formatDate(expiration) {
    const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
    let date = new Date()
    date.setTime( date.getTime() + expiration * 86400000 );
    return `${date.getFullYear()}, ${months[date.getMonth()]}/${date.getDate()}`
}

async function getReferralCoupon(ctx, next) {
    let couponParams
    if (process.env.NODE_ENV == 'development') {
        couponParams = getCouponProductionParams(ctx)
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
    const {domain, couponId} = referral
    const coupon = await Coupon.findOneAndUpdate({domain, couponId}, {
        $inc: {views: 1}
    }, {new: true})
    const {coordinates, expiration} = coupon
    if (!coupon) {
        return await next()
    }

    let {html, css} = coupon
    html = html.replace(`{{${keys.EXPIRATION_DATE}}}`, strings.expirationLabel + formatDate(expiration))

    ctx.body = `<html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${keys.APP_NAME}</title>
            <meta name="host" content="Krop">
            <script
                src="https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&callback=initMap&libraries=&v=weekly"
                async
            ></script>
            <script type="text/javascript" async>
                let map;

                function initMap() {
                    let latLng = { lat: ${coordinates[0]}, lng: ${coordinates[1]} };
                    map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 15,
                        center: latLng,
                    });
                    new google.maps.Marker({
                        position: latLng,
                        map: map,
                    title: "${strings.mapMarkerLabel}",
                    });
                }
            </script>
            <style>${css}</style>
        </head>
        ${html}
    </html>`
}

module.exports = {
    createReferralCoupon,
    deleteReferralCoupon,
    updateReferralCoupon,
    sendReferralCoupon,
    getReferralCoupon
}

