const AWS = require('aws-sdk');
const _ = require('lodash')
const emailValidator = require("email-validator");
const phoneCleaner = require('phone')

const {CampaignResponse} = require('../db/campaign-response');
const {CampaignSession} = require('../db/campaign-session');
const keys = require('../../config/keys')

let strings = {
    en:{
        emailMissingError: "Please enter an email",
        emailInvalidError: "Your email is not valid",
        phoneNumberMissingError: "Please enter a phone number",
        phoneNumberInvalidError: "Your phone number is not valid",
        tryAgainError: "Please try again later",
        phoneValidationTag: "USA"
    },
    kr: {
        emailMissingError: "이메일을 입력해 주세요",
        emailInvalidError: "올바른 이메일이 아니에요!",
        phoneNumberMissingError: "핸드폰 번호를 입력해 주세요",
        phoneNumberInvalidError: "올바른 전화번호가 아니에요!",
        tryAgainError: "죄송합니다. 잠시후 다시 시도해 주세요",
        phoneValidationTag: "KOR"
    }
}
strings = {...strings[process.env.LANGUAGE]}

function sendErrorMessage(ctx, message) {
    ctx.body = message
    ctx.status = 400
}

function cleanPhoneNumber(phone) {
    return phoneCleaner(phone, strings.phoneValidationTag)[0]
}

function emailError(email) {
    if (!email) return strings.emailMissingError
    
    if (!emailValidator.validate(email)) {
        return strings.emailInvalidError
    }
}

function phoneError(phone) {
    if (!phone) return strings.phoneNumberMissingError
    
    if (!cleanPhoneNumber(phone)) {
        return strings.phoneNumberInvalidError
    }
}

function getCampaignError(campaign) {
    switch(campaign.type) {
        case(keys.PHONE_ELEMENT):
            if (phoneError(campaign.value)) return {
                id: campaign.id,
                error: phoneError(campaign.value)
            }
            break
        case(keys.EMAIL_ELEMENT):
            if (emailError(campaign.value)) return {
                id: campaign.id,
                error: emailError(campaign.value)
            }
            break
    }
    return false
}

async function saveCampaignSession(campaignData) {
    try {
        let defaultData = {...campaignData[0]}
        delete defaultData.value
        
        //make profile to session and update
        const profileTypes = [
            keys.ADDRESS_ELEMENT, keys.PHONE_ELEMENT, keys.EMAIL_ELEMENT, keys.NAME_ELEMENT
        ]
        const profileElements = {}
        campaignData.map(s => {
            if (profileTypes.includes(s.type)) {
                profileElements[s.type] = s.value
                profileElements.hasProfile = true
            }
        })
        
        await CampaignSession.findOneAndUpdate({
            sessionId: defaultData.sessionId
        }, {
            $set: { 
                ...defaultData,
                ...profileElements
            }
        }, {upsert: 1}).lean()
    } catch(err) {
        console.log("Failed saveCampaignSession: ", err)
    }
}

async function receiveCampaign(ctx) {
    const body = JSON.parse(ctx.request.rawBody)
    if (!body.data || body.data.length <= 0)  return
    
    const {data, campaignName, sessionId, clientId, campaignId, browser, device, path, accountId} = body
    
    let defaultData = {
        accountId,
        sessionId,
        clientId,
        campaignId,
        browser,
        device,
        campaignName,
        path
    }
    
    let campaignData = []
    let campaignErrors = []
    data.map(campaign => {
        if (getCampaignError(campaign)) {
            campaignErrors.push(getCampaignError(campaign))
        } else {
            if (campaign.type == keys.PHONE_ELEMENT) {
                campaign.value = cleanPhoneNumber(campaign.value)
            }
            campaignData.push({
                questionId: campaign.id,
                ...campaign,
                ...defaultData
            })
        }
    })
    
    if (campaignData.length <= 0 || campaignErrors.length > 0) {
        ctx.body = campaignErrors
        ctx.status = 400
        return
    }
    
    try {
        await saveCampaignSession(campaignData)
        await CampaignResponse.insertMany(campaignData, {ordered: false})
        ctx.body = []
    } catch(err) {
        console.log("Failed receiveCampaign:", err)
        sendErrorMessage(ctx, strings.tryAgainError)
    }
}

module.exports = {receiveCampaign}