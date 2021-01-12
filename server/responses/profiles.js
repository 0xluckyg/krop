const {CampaignSession} = require('../db/campaign-session');
const keys = require('../../config/keys')

async function updateProfile(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)        
        
        const newSession = await CampaignSession.findByIdAndUpdate(body._id, {...body}, {new: true})

        ctx.body = newSession
    } catch (err) {
        console.log('Failed updateProfile: ', err)
        ctx.status = 500
    }
}

function formatProfileQuery(ctx) {
    const {id} = ctx.session
    let { filter, searchText, searchType } = ctx.query
    if (filter) filter = JSON.parse(filter)
    let query = {
        accountId: id,
        hasProfile: true
    }
    
    const neQuery = {$ne : null}
    if (filter.email) {
        query['email'] = neQuery
    }
    if (filter.phone) {
        query['phone'] = neQuery
    }
    if (filter.address) {
        query['address'] = neQuery
    }
    if (filter.name) {
        query['name'] = neQuery
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

async function getProfiles(ctx) {
    try {        
        const limit = keys.PAGE_SIZE

        let { page } = ctx.query
        page = parseInt(page)
            
        let hasPrevious = true; let hasNext = true

        const query = formatProfileQuery(ctx)
        const total = await CampaignSession.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const profiles = await CampaignSession.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {profiles, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getProfiles: ', err)
        ctx.status = 400
    }       
}

async function removeProfile(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await CampaignSession.findByIdAndUpdate(_id, {
            hasProfile: false
        })

        ctx.body = 'profile removed'
    } catch (err) {
        console.log('Failed removeProfile: ', err)
        ctx.status = 500
    }
}

module.exports = {getProfiles, updateProfile, removeProfile}