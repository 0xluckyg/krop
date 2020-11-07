const AWS = require('aws-sdk');
const _ = require('lodash')
const { createClient } = require('pexels')

const {Template} = require('../db/templates');
const {MediaTemplate} = require('../db/media-templates')
const widgetCompiler = require('../widget/compiler')
const {cleanCSS} = require('../builder/compiler/functions')
const keys = require('../../config/keys')
const {authenticateAdmin} = require('./index')

async function getTemplateId() {
    let widgetId = await Template.find().sort({widgetId: -1}).limit(1)
    
    widgetId = (widgetId && widgetId[0]) ? Number(widgetId[0].widgetId) + 1 : 0

    return widgetId
}

function changeDefaultColor(element) {
    let appColor = new RegExp(keys.APP_COLOR,"g");
    let appColorRgb = new RegExp(keys.APP_COLOR_RGB,"g");
    element = element.replace(appColor, '{{PRIMARY_COLOR}}')
    element = element.replace(appColorRgb, '{{PRIMARY_COLOR}}')
    return element
}

function colorWashTemplate(template) {
    if (template.template && template.template.settings) {
        let settings = template.template.settings
        let widgetString = JSON.stringify(template)
        let colorWashedWidget = JSON.parse(changeDefaultColor(widgetString))
        colorWashedWidget.template.settings = settings
        return colorWashedWidget
    } else {
        let widgetString = JSON.stringify(template)
        return JSON.parse(changeDefaultColor(widgetString))
    }
}

async function getCompiledTemplate(widget) {
    widget.accountId = keys.ADMIN
    const widgetId = widget.widgetId ? widget.widgetId : await getTemplateId()
    widget.widgetId = widgetId
    if (widget.template) { 
        widget.template.widgetId = widgetId 
    }
    if (widget.templateType == keys.ELEMENT) {
        const compiledElement = widgetCompiler.compileElement({
            element: {...widget.template}, 
            widgetId, 
            stageIndex: 0, 
            elementIndex: 0, 
            templateMode: keys.TEMPLATE
        })
        const css = await cleanCSS(compiledElement.css)
        return {
            css,
            html: compiledElement.html.outerHTML
        }
    }
    
    if (widget.templateType == keys.STAGE) {
        const compiledStage = widgetCompiler.compileStage({...widget.template}, widgetId, 0)
        const css = await cleanCSS(compiledStage.css)
        return {
            css,
            html: compiledStage.html.outerHTML
        }
    }
    
    if (widget.templateType == keys.WIDGET) {
        let compiled = await widgetCompiler.compiler({...widget.template})
        return {
            ...compiled
        }
    }
}

async function constructTemplate(widget) {
    let simplifiedTags = []
    widget.tags.map(tag => {
        var newTag = tag.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        simplifiedTags.push(newTag)
    })
    widget.tags = [...simplifiedTags]
    
    let total = await  Template.count({category: widget.category})
    widget.index = total
    let template = {...widget}
    template.compiled = await getCompiledTemplate(template)
    template = colorWashTemplate(template)
    template = new Template({...template})
    await template.save()
}

async function createTemplate(ctx) {
    try {
        if (!await authenticateAdmin(ctx)) {
            ctx.status = 400
            ctx.body = 'authenticate failed'
            return
        }
        
        let body = JSON.parse(ctx.request.rawBody)   
        body.key = ctx.session.key
        await constructTemplate(body)
        
        ctx.body = 'Template saved'
    } catch (err) {
        console.log('Failed createWidget: ', err)
        ctx.status = 500
    }
}

async function updateTemplate(ctx) {
    try {
        if (!await authenticateAdmin(ctx)) {
            ctx.status = 400
            ctx.body = 'authenticate failed'
            return
        }

        const body = JSON.parse(ctx.request.rawBody)        
        let template = {...body}
        template.compiled = {...await getCompiledTemplate(template)}
        template = colorWashTemplate(template)
        
        const newWidget = await Template.findByIdAndUpdate(template._id, {...template}, {new: true})

        ctx.body = newWidget
    } catch (err) {
        console.log('Failed updateWidget: ', err)
        ctx.status = 500
    }
}

async function deleteTemplate(ctx) {
    try {
        if (!await authenticateAdmin(ctx)) {
            ctx.status = 400
            ctx.body = 'authenticate failed'
            return
        }
        
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Template.findByIdAndRemove(_id)
        ctx.body = 'Widget removed'
    } catch (err) {
        console.log('Failed deleteWidget: ', err)
        ctx.status = 500
    }
}

async function getTemplates(ctx) {
    try {        
        let {page, category, search, templateType} = ctx.query

        let limit = 100

        page = parseInt(page)
        let query = {
            expiresAt: null
        }
        if (category && category != 'all') query.category = category
        if (templateType) query.templateType = templateType
        if (search && search != '') query.tags = search.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        
        let hasPrevious = true; let hasNext = true
        
        const total = await Template.countDocuments(query)
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const templates = await Template.find(query)
        .sort({index: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {templates, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getTemplates: ', err)
        ctx.status = 400
    }       
}

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

module.exports = {createTemplate, constructTemplate, updateTemplate, deleteTemplate, getTemplates, getMediaTemplates, getPexelsTemplates}