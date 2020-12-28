const AWS = require('aws-sdk');
const moment = require('moment');
const validUrl = require('valid-url')
const _ = require('lodash')

const {Banner} = require('../db/banner');
const {User} = require('../db/user');
const {compiler} = require('./compiler')
const keys = require('../../config/keys')

async function getCompiledBanner(banner) {
    return {
        ...await compiler({...banner})
    }
}

async function createBanner(ctx) {
    try {
        const {key, accessToken} = ctx.session       
        let body = JSON.parse(ctx.request.rawBody)   
        
        let account = await User.findOne({key, accessToken})
        let widget = new Banner({
            ...body,
            accountId: account._id,
            key
        })
    
        widget.compiled = {...await getCompiledBanner(widget.toObject())}
        
        widget = await widget.save()
        ctx.body = 'Banner saved'
    } catch (err) {
        console.log('Failed createBanner: ', err)
        ctx.status = 500
    }
}

async function updateBanner(ctx) {
    try {
        let body = JSON.parse(ctx.request.rawBody)        
        
        const widgetToUpdate = await Banner.findById(body._id, {widgetId: 1})
        body.widgetId = widgetToUpdate.widgetId
        if (body.compile != false) {
            body.compiled = {...await getCompiledBanner(body)}   
        }
        const newBanner = await Banner.findByIdAndUpdate(body._id, {...body}, {new: true})
        ctx.body = newBanner
    } catch (err) {
        console.log('Failed updateBanner: ', err)
        ctx.status = 500
    }
}

async function getBanner(ctx) {
    try {
        const widget = await Banner.findById(ctx.query._id)
        ctx.body = widget
    } catch (err) {
        console.log('Failed getBanners: ', err)
        ctx.status = 400
    }       
}

async function getBanners(ctx) {
    try {        
        const limit = 30
        const key = ctx.session.key
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Banner.countDocuments({key, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const banners = await Banner.find({key, expiresAt: null})
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {banners, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getBanners: ', err)
        ctx.status = 400
    }       
}

async function deleteBanner(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Banner.findByIdAndRemove(_id)
        ctx.body = 'Banner removed'
    } catch (err) {
        console.log('Failed deleteBanner: ', err)
        ctx.status = 500
    }
}

module.exports = {createBanner, getBanners, getBanner, updateBanner, deleteBanner}