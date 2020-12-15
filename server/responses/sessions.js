const {SurveyResponse} = require('../db/survey-responses');
const {SurveyQuestion} = require('../db/survey-questions');
const {Widget} = require('../db/widgets');
const keys = require('../../config/keys')

function formatQuestionQuery(ctx) {
    const accountId = ctx.session.id
    let { campaignId } = ctx.query
    let query = { accountId }
    if (campaignId) {
        query.campaignId = campaignId
    }
    console.log("question query: ", query)
    return query
}

async function getSurveyQuestions(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatQuestionQuery(ctx)
        const total = await SurveyQuestion.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const surveys = await SurveyQuestion.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        console.log("question response: ", surveys)

        ctx.body = {surveys, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getProfiles: ', err)
        ctx.status = 400
    }
}

function formatResponseQuery(ctx) {
    const accountId = ctx.session.id
    let { campaignId, questionId } = ctx.query
    let query = { accountId }
    if (campaignId) {
        query.campaignId = campaignId
    }
    if (questionId) {
        query.questionId = questionId
    }
    return query
}

async function getSurveyResponses(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatResponseQuery(ctx)
        const total = await SurveyResponse.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const surveys = await SurveyResponse.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {surveys, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getProfiles: ', err)
        ctx.status = 400
    }
}

async function deleteResponse(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await SurveyResponse.findByIdAndRemove(_id)

        ctx.body = 'response removed'
    } catch (err) {
        console.log('Failed deleteResponse: ', err)
        ctx.status = 500
    }
}

async function getSurveyWidgets(ctx) {
    try {        
        const limit = 30
        const key = ctx.session.key
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Widget.countDocuments({key, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const surveys = await Widget.find({
            key, 
            expiresAt: null,
            'surveyCount': { 
                $gte: 0
            },
        }, {settings: 1, enabled: 1, views: 1, submits: 1, surveyCount: 1, updatedAt: 1})
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        surveys.map((survey, i) => {
            let {settings, enabled, submits, views, surveyCount, updatedAt} = survey
            let {name, device} = settings
            surveys[i] = {
                name,
                device,
                enabled,
                submits,
                views,
                surveyCount,
                updatedAt
            }
        })
        
        ctx.body = {surveys, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getWidgets: ', err)
        ctx.status = 400
    }     
}

module.exports = {getSurveyQuestions, getSurveyResponses, deleteResponse, getSurveyWidgets}