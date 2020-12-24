const {SurveyResponse} = require('../db/survey-response');
const keys = require('../../config/keys')

function formatSurveyResponseQuery(ctx) {
    const {id} = ctx.session
    let { filter } = ctx.query
    filter ? filter = JSON.parse(filter) : filter = {}
    filter.accountId = id
    
    return filter
}

async function getSurveyResponses(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatSurveyResponseQuery(ctx)
        const total = await SurveyResponse.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const responses = await SurveyResponse.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {responses, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getSurveyResponses: ', err)
        ctx.status = 400
    }       
}

module.exports = {getSurveyResponses}