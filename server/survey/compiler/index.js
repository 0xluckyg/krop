const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileFrameCSS, compileFrameHTML} = require('./frame')
const {compilePageCSS, compilePageHTML} = require('./page')
const {compileShareCSS, compileShareHTML} = require('./share')
const {compileReferralCSS, compileReferralHTML} = require('./referral')
const {compileButtonCSS, compileButtonHTML} = require('./button')
const {compileAlertCSS, compileAlertTextCSS, compileAlertHTML, compileAlertTextHTML} = require('./alert')
const {compileSpacingCSS, compileSpacingHTML} = require('./spacing')
const {compileImageCSS, compileImageHTML} = require('./image')
const {compileVideoCSS, compileVideoHTML} = require('./video')
const {compileLinkCSS, compileLinkHTML} = require('./link')
const {compileSliderCSS, compileSliderHTML} = require('./slider')
const {compileMultipleChoiceCSS, compileMultipleChoiceHTML} = require('./multiple-choice')
const {compileCheckboxCSS, compileCheckboxHTML} = require('./checkbox')
const {compileDropdownCSS, compileDropdownHTML} = require('./dropdown')
const {compileFormCSS, compileFormHTML} = require('./form')
const {compileLongFormCSS, compileLongFormHTML, compileLongFormJS} = require('./long-form')
const {compileTextCSS, compileTextHTML} = require('./text')
const {compileNameCSS, compileNameHTML} = require('./name')
const {compileAddressCSS, compileAddressHTML} = require('./address')
const {compileQuestionCSS, compileElementContainerCSS, compileGeneralTextCSS} = require('./reusable')
const {cleanCSS} = require('./functions')

async function compileJS(options) {
    let js = ''
    let types = {}
    options.stages.map((stage, stageIndex) => {
        stage.elements.map((element, elementIndex) => {
            if (!types[element.type]) {
                let elementJS = ''
                switch(element.type) {
                    case(keys.LONG_FORM_ELEMENT):
                        elementJS += compileLongFormJS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    default:
                        break;
                }
                
                
                types[element.type] = elementJS
            }
        })
    })
    
    Object.keys(types).map(key => {
        js += types[key]
    })
    
    return js
}

async function compileCSS(options) {
    let css = compileFrameCSS(options)
    css += compilePageCSS(options)
    css += compileElementContainerCSS(options)
    css += compileQuestionCSS(options)
    css += compileAlertCSS(options)
    css += compileAlertTextCSS(options)
    css += compileButtonCSS(options)
    css += compileGeneralTextCSS(options)
    
    let types = {}
    options.stages.map((stage, stageIndex) => {
        stage.elements.map((element, elementIndex) => {
            if (!types[element.type]) {
                let elementCSS = ''
                switch(element.type) {
                    case(keys.SHARE_ELEMENT):
                        elementCSS += compileShareCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.REFERRAL_ELEMENT):
                        elementCSS += compileReferralCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.SPACING_ELEMENT):
                        elementCSS += compileSpacingCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.IMAGE_ELEMENT):
                        elementCSS += compileImageCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.VIDEO_ELEMENT):
                        elementCSS += compileVideoCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.LINK_ELEMENT):
                        elementCSS += compileLinkCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.SLIDER_ELEMENT):
                        elementCSS += compileSliderCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.MULTIPLE_CHOICE_ELEMENT):
                        elementCSS += compileMultipleChoiceCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.CHECKBOX_ELEMENT):
                        elementCSS += compileCheckboxCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.DROPDOWN_ELEMENT):
                        elementCSS += compileDropdownCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.NAME_ELEMENT):
                        elementCSS += compileNameCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                    case(keys.ADDRESS_ELEMENT):
                        elementCSS += compileAddressCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                    case(keys.FORM_ELEMENT):
                    case(keys.EMAIL_ELEMENT):
                    case(keys.PHONE_ELEMENT):
                        elementCSS += compileFormCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.LONG_FORM_ELEMENT):
                        elementCSS += compileLongFormCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.HEADING_ELEMENT):
                    case(keys.SUBHEADING_ELEMENT):
                    case(keys.PARAGRAPH_ELEMENT):
                        elementCSS += compileTextCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    default:
                        break;
                }
                
                
                types[element.type] = elementCSS
            }
        })
    })
    
    Object.keys(types).map(key => {
        css += types[key]
    })
    
    return css
}

function compileElement(options) {
    const {element} = options
    switch(element.type) {
        case(keys.SHARE_ELEMENT):
            return compileShareHTML(options).outerHTML
        case(keys.REFERRAL_ELEMENT):
            return compileReferralHTML(options).outerHTML
        case(keys.SPACING_ELEMENT):
            return compileSpacingHTML(options).outerHTML
        case(keys.SPACING_ELEMENT):
            return compileSpacingHTML(options).outerHTML
        case(keys.IMAGE_ELEMENT):
            return compileImageHTML(options).outerHTML
        case(keys.VIDEO_ELEMENT):
            return compileVideoHTML(options).outerHTML
        case(keys.LINK_ELEMENT):
            return compileLinkHTML(options).outerHTML
        case(keys.SLIDER_ELEMENT):
            return compileSliderHTML(options).outerHTML
        case(keys.MULTIPLE_CHOICE_ELEMENT):
            return compileMultipleChoiceHTML(options).outerHTML
        case(keys.CHECKBOX_ELEMENT):
            return compileCheckboxHTML(options).outerHTML
        case(keys.DROPDOWN_ELEMENT):
            return compileDropdownHTML(options).outerHTML
        case(keys.FORM_ELEMENT):
        case(keys.EMAIL_ELEMENT):
        case(keys.PHONE_ELEMENT):
            return compileFormHTML(options).outerHTML
        case(keys.LONG_FORM_ELEMENT):
            return compileLongFormHTML(options).outerHTML
        case(keys.NAME_ELEMENT):
            return compileNameHTML(options).outerHTML
        case(keys.ADDRESS_ELEMENT):
            return compileAddressHTML(options).outerHTML
        case(keys.HEADING_ELEMENT):
        case(keys.SUBHEADING_ELEMENT):
        case(keys.PARAGRAPH_ELEMENT):
            return compileTextHTML(options).outerHTML
        default:
            return null
    }
}


function compileStage(options) {
    const {stage} = options
    
    const compiledStage = {
        settings: stage.settings,
        elements: []
    }
    
    stage.elements.map((element, i) => {
        const elementIndex = stage.elements.length - i
        const compiledElement = compileElement({
            element, 
            elementIndex, 
            ...options
        })
        if (compiledElement) {
            compiledStage.elements.push(compiledElement)   
        }
    })
    
    return compiledStage
}

async function compiler(surveyOptions) {
    const frameHTML = compileFrameHTML(surveyOptions).outerHTML
    const pageHTML = compilePageHTML(surveyOptions).outerHTML
    const buttonHTML = compileButtonHTML(surveyOptions).outerHTML
    const alertHTML = compileAlertHTML(surveyOptions).outerHTML
    const alertTextHTML = compileAlertTextHTML(surveyOptions).outerHTML

    const {stages, styles, alertMessages} = surveyOptions
    let compiledStages = []
    stages.map((stage, stageIndex) => {
        const compiledStage = compileStage({
            stage, stageIndex, ...surveyOptions
        })
        compiledStages.push(compiledStage)
    })
    
    let css = await compileCSS(surveyOptions)
    css = await cleanCSS(css)
    
    let js = await compileJS(surveyOptions)
    
    return {
        css, 
        js,
        stages: compiledStages, 
        frame: frameHTML, 
        font: styles.font,
        page: pageHTML,
        button: buttonHTML,
        alert: alertHTML,
        alertText: alertTextHTML,
    }
}

module.exports = {
    compiler, 
    compileElement, 
    compileStage
}