const AWS = require('aws-sdk');
const moment = require('moment');
const validUrl = require('valid-url')
const _ = require('lodash')

const {Campaign} = require('../db/campaign');
const {User} = require('../db/user');
const campaignCompiler = require('../campaign/compiler')
const {updateCampaignQuestions, removeCampaignQuestions} = require('./functions')
const {updateReferralCoupon} = require('../referral')
const keys = require('../../config/keys')

let strings = {
    en:{
        pathError: "There is already a campaign on this path",
    },
    kr: {
        pathError: "이 경로는 이미 사용중 이에요"
    }
}
strings = {...strings[process.env.LANGUAGE]}

async function getCompiledCampaign(campaign) {
    return {
        ...await campaignCompiler.compiler({...campaign})
    }
}

async function checkIfPathExists(ctx) {
    const {id} = ctx.session
    let body = JSON.parse(ctx.request.rawBody) 
    let campaignInPath = await Campaign.findOne({
        accountId: id,
        path: body.path,
        _id: {
            $ne: body._id
        }
    })

    return campaignInPath
}

const pathError = strings.pathError
async function createCampaign(ctx) {
    try {
        if (await checkIfPathExists(ctx)) {
            ctx.body = pathError
            ctx.status = 400
            return
        }
        
        const {id} = ctx.session       
        let body = JSON.parse(ctx.request.rawBody) 
        
        let campaign = new Campaign({
            ...body,
            accountId: id
        })
    
        campaign.compiled = {...await getCompiledCampaign(campaign.toObject())}
        await campaign.save()
        const campaignOptions = {
            ...campaign.toObject(), 
            campaignId: campaign._id,
            campaignName: campaign.settings.name
        }
        await updateCampaignQuestions(campaignOptions)
        await updateReferralCoupon(campaignOptions)

        ctx.body = 'Campaign saved'
    } catch (err) {
        console.log('Failed createCampaign: ', err)
        ctx.status = 500
    }
}

async function updateCampaign(ctx) {
    try {
        if (await checkIfPathExists(ctx)) {
            ctx.body = pathError
            ctx.status = 400
            return
        }

        let body = JSON.parse(ctx.request.rawBody)
        
        const {campaignId, accountId, settings} = await Campaign.findOne({
            _id: body._id}, {campaignId: 1, accountId: 1, settings: 1
        }).lean()
        body.campaignId = campaignId
        if (body.compile != false) {
            body.compiled = {...await getCompiledCampaign(body)}
        }
        const newCampaign = await Campaign.findOneAndUpdate({_id:body._id}, {
            ...body,
        }, {new: true})
        const campaignOptions = {
            ...body, 
            campaignId: body._id, 
            accountId: accountId,
            campaignName: settings.name
        }
        await updateCampaignQuestions(campaignOptions)
        await updateReferralCoupon(campaignOptions)

        ctx.body = newCampaign
    } catch (err) {
        console.log('Failed updateCampaign: ', err)
        ctx.status = 500
    }
}

async function getCampaign(ctx) {
    try {
        const widget = await Campaign.findById(ctx.query._id)
        ctx.body = widget
    } catch (err) {
        console.log('Failed getCampaigns: ', err)
        ctx.status = 400
    }       
}

async function getCampaigns(ctx) {
    try {        
        const limit = keys.PAGE_SIZE
        const {id} = ctx.session
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Campaign.countDocuments({accountId: id, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const campaigns = await Campaign.find({accountId: id, expiresAt: null})
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {campaigns, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getCampaigns: ', err)
        ctx.status = 400
    }       
}

async function deleteCampaign(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Campaign.findByIdAndRemove(_id)
        
        await removeCampaignQuestions({campaignId: _id})
        
        ctx.body = 'Campaign removed'
    } catch (err) {
        console.log('Failed deleteCampaign: ', err)
        ctx.status = 500
    }
}

module.exports = {createCampaign, getCampaigns, getCampaign, updateCampaign, deleteCampaign}