const AWS = require('aws-sdk');
const _ = require('lodash')
const emailValidator = require("email-validator");
const phoneCleaner = require('phone')

const {SurveyResponse} = require('../db/survey-response');
const {SurveySession} = require('../db/survey-session');
const keys = require('../../config/keys')

function sendErrorMessage(ctx, message) {
    ctx.status = 400
    ctx.body = message
}

function cleanPhoneNumber(phone) {
    return phoneCleaner(phone, 'KOR')[0]
}

function emailError(email) {
    if (!email) return 'Please enter an email'
    
    if (!emailValidator.validate(email)) {
        return 'Your email is not valid.'
    }
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
            if (phoneError(survey.value)) return {
                id: survey.id,
                error: phoneError(survey.value)
            }
            break
        case(keys.EMAIL_ELEMENT):
            if (emailError(survey.value)) return {
                id: survey.id,
                error: emailError(survey.value)
            }
            break
    }
    return false
}

async function saveSurveySession(surveyData) {
    try {
        let defaultData = surveyData
        delete defaultData.value
        
        //make profile to session and update
        const profileTypes = [
            keys.ADDRESS_ELEMENT, keys.PHONE_ELEMENT, keys.EMAIL_ELEMENT, keys.NAME_ELEMENT
        ]
        const profileElements = {}
        surveyData.map(s => {
            if (profileTypes.includes(s.type)) {
                profileElements[s.type] = s.value
                profileElements.hasProfile = true
            }
        })
        
        await SurveySession.findOneAndUpdate({
            sessionId: defaultData.sessionId
        }, {
            $set: { 
                ...defaultData,
                ...profileElements
            }
        }, {upsert: 1}).lean()
    } catch(err) {
        console.log("Failed saveSurveySession: ", err)
    }
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
    let surveyErrors = []
    data.map(survey => {
        if (getSurveyError(survey)) {
            surveyErrors.push(getSurveyError(survey))
        } else {
            if (survey.type == keys.PHONE_ELEMENT) {
                survey.value = cleanPhoneNumber(survey.value)
            }
            surveyData.push({
                questionId: survey.id,
                ...survey,
                ...defaultData
            })
        }
    })
    
    if (surveyData.length <= 0 || surveyErrors.length > 0) {
        ctx.body = surveyErrors
        ctx.status = 400
        return
    }
    
    try {
        await saveSurveySession(surveyData)
        await SurveyResponse.insertMany(surveyData, {ordered: false})
        ctx.body = []
    } catch(err) {
        console.log("Failed receiveSurvey:", err)
        sendErrorMessage(ctx, 'Please try again later')
    }
}

module.exports = {receiveSurvey}