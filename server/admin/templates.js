const AWS = require('aws-sdk');
const _ = require('lodash')
const { createClient } = require('pexels')

const {MediaTemplate} = require('../db/media-templates')
const keys = require('../../config/keys')

async function getMediaTemplates(ctx) {
    try {        
        let {page, category, search, templateType} = ctx.query
    
        let limit = 100
        if (category == keys.ILLUSTRATION_CATEGORY || category == keys.PHOTOGRAPH_CATEGORY) {
            limit = 25
        }
        
        page = parseInt(page)
        let query = {
            expiresAt: null
        }
        if (category && category != 'all') query.category = category
        if (templateType) query.templateType = templateType
        if (search && search != '') query.tags = search.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        
        let hasPrevious = true; let hasNext = true
        
        const total = await MediaTemplate.countDocuments(query)
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const templates = await MediaTemplate.find(query)
        .sort({index: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {templates, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getTemplates: ', err)
        ctx.status = 400
    }       
}

async function getPexelsTemplates(ctx) {
    // https://www.pexels.com/api/documentation/?language=javascript
    try {        
        let {page, category, search} = ctx.query
        let per_page = keys.PAGE_SIZE
        page = parseInt(page)
        
        const client = createClient(process.env.PEXELS_API_KEY);
        const query = search ? search : 'nature';
        
        const pexelsPhotos = await client.photos.search({ query, per_page, page })
        const {total_results, photos} = pexelsPhotos 
        
        let templates = []
        photos.map(photo => {
            const {width, height, src} = photo
            const {original, large, medium} = src
            
            let media = original
            if (category == keys.PHOTOGRAPH_HD_CATEGORY) {
                media = large
            }
            let mediaTemplate = {
                mediaType: 'url',
                category,
                width: width,
                height: height,
                media,
                mediaLarge: large,
                mediaSmall: medium
            }  
            templates.push(mediaTemplate)
        })
        
        let total = total_results
        let totalPages = Math.ceil(total / per_page)
        let hasNext = (( total - (per_page * page) ) > 0) ? true : false
        let hasPrevious = (page == 1) ? false : true
        
        ctx.body = {templates, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getPexelsTemplates: ', err)
        ctx.status = 400
    }       
}

module.exports = {getMediaTemplates, getPexelsTemplates}