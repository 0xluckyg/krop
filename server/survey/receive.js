const AWS = require('aws-sdk');
const _ = require('lodash')
const emailValidator = require("email-validator");
const phoneCleaner = require('phone')

const {SurveyResponse} = require('../db/survey-responses');
const keys = require('../../config/keys')

function sendErrorMessage(ctx, message) {
    ctx.status = 400
    ctx.body = message
}

function emailError(email) {
    if (!email) return 'Please enter an email'
    
    if (!emailValidator.validate(email)) return 'Your email is not valid.'
    
    return false
}

function cleanPhoneNumber(phone) {
    return phoneCleaner(phone, 'KOR')[0]
}

function phoneError(phone) {
    if (!phone) return 'Please enter a phone number'
    
    if (!cleanPhoneNumber(phone)) {
        return 'Your phone number is not valid'
    }
}

function getSurveyError(survey) {
    switch(survey.type) {
        case(keys.PHONE_ELEMENT):
            if (phoneError(survey.value)) return phoneError(survey.value)
        case(keys.EMAIL_ELEMENT):
            if (emailError(survey.value)) return emailError(survey.value)
    }
    return true
}

async function receiveSurvey(ctx) {
    const body = JSON.parse(ctx.request.rawBody)
    if (!body.data || body.data.length <= 0)  return
    
    const {data, sessionId, clientId, surveyId, browser, device, path, accountId} = body
    
    let defaultData = {
        accountId,
        sessionId,
        clientId,
        surveyId,
        browser,
        device,
        path
    }
    
    let surveyData = []
    let surveyError = false
    data.map(survey => {
        if (getSurveyError(survey)) {
            surveyError = getSurveyError(survey)
        } else {
            if (survey.type == keys.PHONE_ELEMENT) {
                survey.value = cleanPhoneNumber(survey.value)
            }
            surveyData.push({
                ...survey,
                ...defaultData
            })
        }
    })
    
    if (surveyError) {
        ctx.status = 400
        ctx.body = surveyError
    }
    
    try {
        await SurveyResponse.insertMany(surveyData, {ordered: false})
        ctx.body = {}
    } catch(e) {
        sendErrorMessage(ctx, 'Please try again later')
    }
}

module.exports = {receiveSurvey}