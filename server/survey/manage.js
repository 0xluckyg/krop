const AWS = require('aws-sdk');
const moment = require('moment');
const validUrl = require('valid-url')
const _ = require('lodash')

const {Survey} = require('../db/survey');
const {User} = require('../db/user');
const surveyCompiler = require('../survey/compiler')
const {updateSurveyQuestions, removeSurveyQuestions} = require('./functions')
const keys = require('../../config/keys')

async function getCompiledSurvey(survey) {
    return {
        ...await surveyCompiler.compiler({...survey})
    }
}

async function checkIfPathExists(ctx) {
    const {id} = ctx.session
    let body = JSON.parse(ctx.request.rawBody) 
    let surveyInPath = await Survey.findOne({
        accountId: id,
        path: body.path,
        _id: {
            $ne: body._id
        }
    })
    console.log(":PAH ", body.path)
    console.log(":SU ", surveyInPath)
    return surveyInPath
}

const pathError = 'There is already a campaign on this path.'
async function createSurvey(ctx) {
    try {
        if (await checkIfPathExists(ctx)) {
            ctx.body = pathError
            ctx.status = 400
            return
        }
        
        const {id} = ctx.session       
        let body = JSON.parse(ctx.request.rawBody) 
        
        let survey = new Survey({
            ...body,
            accountId: id
        })
    
        survey.compiled = {...await getCompiledSurvey(survey.toObject())}
        await survey.save()
        const surveyOptions = {
            ...survey.toObject(), 
            surveyId: survey._id,
            surveyName: survey.settings.name
        }
        await updateSurveyQuestions(surveyOptions)
        
        ctx.body = 'Survey saved'
    } catch (err) {
        console.log('Failed createSurvey: ', err)
        ctx.status = 500
    }
}

async function updateSurvey(ctx) {
    try {
        if (await checkIfPathExists(ctx)) {
            ctx.body = pathError
            ctx.status = 400
            return
        }

        let body = JSON.parse(ctx.request.rawBody)
        
        const {surveyId, accountId, settings} = await Survey.findOne({
            _id: body._id}, {surveyId: 1, accountId: 1, settings: 1
        }).lean()
        body.surveyId = surveyId
        if (body.compile != false) {
            body.compiled = {...await getCompiledSurvey(body)}
        }
        const newSurvey = await Survey.findOneAndUpdate({_id:body._id}, {
            ...body,
        }, {new: true})
        await updateSurveyQuestions({
            ...body, 
            surveyId: body._id, 
            accountId: accountId,
            surveyName: settings.name
        })
        
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
        const limit = keys.PAGE_SIZE
        const {id} = ctx.session
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Survey.countDocuments({accountId: id, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const surveys = await Survey.find({accountId: id, expiresAt: null})
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
        
        await removeSurveyQuestions({surveyId: _id})
        
        ctx.body = 'Survey removed'
    } catch (err) {
        console.log('Failed deleteSurvey: ', err)
        ctx.status = 500
    }
}

module.exports = {createSurvey, getSurveys, getSurvey, updateSurvey, deleteSurvey}