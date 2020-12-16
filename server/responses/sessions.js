const {SurveySession} = require('../db/survey-session');
const keys = require('../../config/keys')

function formatSurveySessionQuery(ctx) {
    const {id} = ctx.session
    let { filter, searchText, searchType } = ctx.query
    if (filter) filter = JSON.parse(filter)
    let query = {
        accountId: id
    }
    
    if (searchText && searchText != '') {
        const matchQuery = {$eq: searchText}
        if (query[searchType]) {
            query[searchType] = {...query[searchType], ...matchQuery}
        } else {
            query[searchType] = matchQuery   
        }
    }
    
    return query
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