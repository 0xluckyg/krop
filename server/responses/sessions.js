const {CampaignSession} = require('../db/campaign-session');
const keys = require('../../config/keys')

function formatCampaignSessionQuery(ctx) {
    const {id} = ctx.session
    let { filter } = ctx.query
    filter ? filter = JSON.parse(filter) : filter = {}
    filter.accountId = id
    
    return filter
}

async function getCampaignSessions(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatCampaignSessionQuery(ctx)
        const total = await CampaignSession.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const sessions = await CampaignSession.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {sessions, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getCampaignSessions: ', err)
        ctx.status = 400
    }       
}

module.exports = {getCampaignSessions}