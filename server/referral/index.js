const {Campaign} = require('../db/campaign');

async function createReferralCoupon(ctx) {
    let body = JSON.parse(ctx.request.rawBody) 
    const {clientId, sessionId, campaignId, accountId} = body

}

module.exports = {
    createReferralCoupon
}