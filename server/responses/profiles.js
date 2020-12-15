const {Profile} = require('../db/profiles');
const keys = require('../../config/keys')

async function updateProfile(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)        
        
        const newProfile = await Profile.findByIdAndUpdate(body._id, {...body}, {new: true})

        ctx.body = newProfile
    } catch (err) {
        console.log('Failed updateProfile: ', err)
        ctx.status = 500
    }
}

function formatProfileQuery(ctx) {
    const key = ctx.session.key
    let { filter, searchText, searchType } = ctx.query
    if (filter) filter = JSON.parse(filter)
    let query = {
        key, 
        expiresAt: null
    }
    
    const neQuery = {$ne : null}
    if (filter.email) {
        query['email.value'] = neQuery
    }
    if (filter.mobile) {
        query['mobile.value'] = neQuery
    }
    
    if (searchText && searchText != '') {
        const matchQuery = {$eq: searchText}
        if (searchType == keys.MOBILE_PROPERTY || searchType == 'email') searchType = searchType + '.value'
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
        const total = await Profile.countDocuments(query)        
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const profiles = await Profile.find(query)
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)

        ctx.body = {profiles, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getProfiles: ', err)
        ctx.status = 400
    }       
}

async function deleteProfile(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Profile.findByIdAndRemove(_id)

        ctx.body = 'profile removed'
    } catch (err) {
        console.log('Failed deleteProfile: ', err)
        ctx.status = 500
    }
}

module.exports = {getProfiles, updateProfile, deleteProfile}