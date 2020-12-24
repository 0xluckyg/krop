const {SurveySession} = require('../db/survey-session');
const keys = require('../../config/keys')

function formatSurveySessionQuery(ctx) {
    const {id} = ctx.session
    let { filter } = ctx.query
    filter ? filter = JSON.parse(filter) : filter = {}
    filter.accountId = id
    
    return filter
}

async function getSurveySessions(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatSurveySessionQuery(ctx)
        const total = await SurveySession.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const sessions = await SurveySession.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {sessions, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getSurveySessions: ', err)
        ctx.status = 400
    }       
}

module.exports = {getSurveySessions}