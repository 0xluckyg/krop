const {CampaignResponse} = require('../db/campaign-response');
const keys = require('../../config/keys')

function formatCampaignResponseQuery(ctx) {
    const {id} = ctx.session
    let { filter } = ctx.query
    filter ? filter = JSON.parse(filter) : filter = {}
    filter.accountId = id
    
    return filter
}

async function getCampaignResponses(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatCampaignResponseQuery(ctx)
        const total = await CampaignResponse.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const responses = await CampaignResponse.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {responses, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getCampaignResponses: ', err)
        ctx.status = 400
    }       
}

module.exports = {getCampaignResponses}