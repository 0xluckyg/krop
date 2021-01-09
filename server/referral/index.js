const {Survey} = require('../db/survey');

async function createReferralCoupon(ctx) {
    let body = JSON.parse(ctx.request.rawBody) 
    const {clientId, sessionId, surveyId, accountId} = body

}

module.exports = {
    createReferralCoupon
}