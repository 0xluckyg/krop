const AWS = require('aws-sdk');
const moment = require('moment');
const validUrl = require('valid-url')
const _ = require('lodash')

const {Survey} = require('../db/survey');
const {User} = require('../db/user');
const surveyCompiler = require('../survey/compiler')

async function getCompiledSurvey(survey) {
    return {
        ...await surveyCompiler.compiler({...survey})
    }
}

async function getSurveyId(ctx) {
    const {key} = ctx.session
    let surveyId = await Survey.find({key}).sort({surveyId: -1}).limit(1)

    surveyId = (surveyId && surveyId[0]) ? surveyId[0].surveyId + 1 : 0

    return surveyId
}

async function createSurvey(ctx) {
    try {
        const {id} = ctx.session       
        let body = JSON.parse(ctx.request.rawBody)   
        let {domain, enabled} = body.settings
        let surveyId = await getSurveyId(ctx)
        let survey = new Survey({
            ...body,
            domain,
            enabled,
            accountId: id,
            surveyId
        })
    
        survey.compiled = {...await getCompiledSurvey(survey.toObject())}
        console.log("COMPILED: ", survey.compiled)
        survey = await survey.save()
        // await saveSurveyQuestions({
        //     ...widget, 
        //     campaignId: widget._id,
        //     campaignName: widget.settings.name
        // })
        
        ctx.body = 'Survey saved'
    } catch (err) {
        console.log('Failed createSurvey: ', err)
        ctx.status = 500
    }
}

async function updateSurvey(ctx) {
    try {
        let body = JSON.parse(ctx.request.rawBody)
        
        const {surveyId} = await Survey.findOne({_id: body._id}, {surveyId: 1, accountId: 1, settings: 1}).lean()
        body.surveyId = surveyId
        let {domain, enabled} = body.settings
        if (body.compile != false) {
            body.compiled = {...await getCompiledSurvey(body)}
        }
        const newSurvey = await Survey.findOneAndUpdate({_id:body._id}, {
            ...body,
            domain,
            enabled
        }, {new: true})
        // await updateSurveyQuestions({
        //     ...body, 
        //     campaignId: body._id, 
        //     accountId: accountId,
        //     campaignName: settings.name
        // })
        
        ctx.body = newSurvey
    } catch (err) {
        console.log('Failed updateSurvey: ', err)
        ctx.status = 500
    }
}

async function getSurvey(ctx) {
    try {
        const widget = await Survey.findById(ctx.query._id)
        ctx.body = widget
    } catch (err) {
        console.log('Failed getSurveys: ', err)
        ctx.status = 400
    }       
}

async function getSurveys(ctx) {
    try {        
        const limit = 30
        const key = ctx.session.key
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Survey.countDocuments({key, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const surveys = await Survey.find({key, expiresAt: null})
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {surveys, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getSurveys: ', err)
        ctx.status = 400
    }       
}

async function deleteSurvey(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Survey.findByIdAndRemove(_id)
        
        // await removeSurveyQuestions({campaignId: _id})
        
        ctx.body = 'Survey removed'
    } catch (err) {
        console.log('Failed deleteSurvey: ', err)
        ctx.status = 500
    }
}

module.exports = {createSurvey, getSurveys, getSurvey, updateSurvey, deleteSurvey}