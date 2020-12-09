const AWS = require('aws-sdk');
const _ = require('lodash')

const {Survey} = require('../db/survey');
const {Profile} = require('../db/profile')
const {SurveyResponse} = require('../db/survey-responses');
const keys = require('../../config/keys')
const {getSurveyId} = require('./functions')

function sendErrorMessage(ctx, message) {
    ctx.status = 400
    ctx.body = message
}

async function incrementWidgetSubmit(_id) {
    await Survey.update({
        _id,
    }, {
        $inc: { submits: 1 } 
    })
}

async function validateWidgetResponse(ctx) {
    try {

        const body = JSON.parse(ctx.request.rawBody)
        if (!body.inputs) return
        
        const validateError = await Profile.validate({
            email: body.inputs.email,
            mobile: body.inputs.mobile
        })
        
        if (!validateError) {
            ctx.body = {}
        } else {
            sendErrorMessage(ctx, validateError)
        }
        
    } catch (err) {
        console.log('Failed validateWidgetResponse: ', err)
        ctx.status = 500
    }
}

async function saveWidgetResponse(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)
        
        if ((!body.inputs || body.inputs.length <= 0) 
        && (!body.surveys || body.surveys.length <= 0)) return
        
        const widget = await Survey.findOne({_id: body.campaignId}, {accountId: 1, key: 1, settings: 1}).lean()
        const contact = await saveProfileResponse(ctx, {...body, ...widget})
        await saveSurveyResponse(ctx, {...body, ...widget, profileId: contact._id})
        
    } catch (err) {
        console.log('Failed saveWidgetResponse: ', err)
        ctx.status = 400
    }
}

async function saveProfileResponse(ctx, body) {
    const {inputs, sessionId, clientId, campaignId, browser, device, path, key, accountId} = body
    
    if (!inputs || inputs.length <= 0) return {}
    
    let email = {};
    let mobile = {};
    let profile = {};
    inputs.map(input => {
        switch(input.type) {
            case('email'):
                email.value = input.value 
                email.updatedAt = new Date()
                email.lastActive = new Date()
                email.tags = [...input.tags]
                break;
            case(keys.MOBILE_PROPERTY):
                mobile.value = input.value 
                mobile.updatedAt = new Date()
                mobile.lastActive = new Date()
                mobile.tags = [...input.tags]
                break;
            default:
                profile[input.type] = input.value
                profile.updatedAt = new Date()
                profile.lastActive = new Date()
                profile.tags = [...input.tags]
                
        }
    })

    const contact = new Profile({
        clientId,
        sessionId,
        campaignId,
        accountId,
        key,
        
        path,
        browser,
        device,
        
        email,
        mobile,
        profile
    })
    
    const validateError = await Profile.validate(contact)
    if (!validateError) {
        await incrementWidgetSubmit(campaignId)
        await contact.save()
        ctx.body = {}
    } else {
        sendErrorMessage(ctx, validateError)
    }
    
    return contact ? contact : {}
} 

async function saveSurveyResponse(ctx, body) {
    const {surveys, sessionId, clientId, campaignId, browser, device, path, accountId, profileId} = body
    
    if (!surveys || surveys.length <= 0) return
    let defaultData = {
        accountId,
        sessionId,
        clientId,
        campaignId,
        browser,
        device,
        path,
        profileId
    }
    
    let surveyData = []
    surveys.map(survey => {
        const surveyId = getSurveyId(survey.question, survey.options, campaignId)
        const valueSearchId = survey.value + ''
        surveyData.push({
            ...survey,
            ...defaultData,
            surveyId,
            valueSearchId
        })
    })
    
    try {
        await SurveyResponse.insertMany(surveyData, {ordered: false})
        ctx.body = {}
    } catch(e) {
        sendErrorMessage(ctx, 'Please try again later')
    }
}

module.exports = {validateWidgetResponse, saveWidgetResponse}