const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileFrameCSS, compileFrameHTML} = require('./frame')
// const {compileAlert} = require('./alert')
const {compileSpacingCSS, compileSpacingHTML} = require('./spacing')
const {compileLinkCSS, compileLinkHTML} = require('./link')
const {compileMultipleChoiceCSS, compileMultipleChoiceHTML} = require('./multiple-choice')
const {compileCheckboxCSS, compileCheckboxHTML} = require('./checkbox')
const {compileDropdownCSS, compileDropdownHTML} = require('./dropdown')
const {compileFormCSS, compileFormHTML} = require('./form')
const {compileTextCSS, compileTextHTML} = require('./text')
const {compileNameCSS, compileNameHTML} = require('./name')
const {compileAddressCSS, compileAddressHTML} = require('./address')
const {compileQuestionCSS, compileElementContainerCSS, compileAlertTextCSS, compileGeneralTextCSS} = require('./reusable')
const {cleanCSS} = require('./functions')

async function compileCSS(options) {
    let css = compileFrameCSS(options)
    css += compileElementContainerCSS(options)
    css += compileQuestionCSS(options)
    css += compileAlertTextCSS(options)
    css += compileGeneralTextCSS(options)
    
    let types = {}
    options.stages.map((stage, stageIndex) => {
        stage.elements.map((element, elementIndex) => {
            if (!types[element.type]) {
                let elementCSS = ''
                switch(element.type) {
                    case(keys.SPACING_ELEMENT):
                        elementCSS += compileSpacingCSS({
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
                    case(keys.LONG_FORM_ELEMENT):
                        elementCSS += compileFormCSS({
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
    const {stage, element, stageIndex, elementIndex} = options
    switch(element.type) {
        case(keys.SPACING_ELEMENT):
            return compileSpacingHTML(options).outerHTML
        case(keys.LINK_ELEMENT):
            return compileLinkHTML(options).outerHTML
        case(keys.MULTIPLE_CHOICE_ELEMENT):
            return compileMultipleChoiceHTML(options).outerHTML
        case(keys.CHECKBOX_ELEMENT):
            return compileCheckboxHTML(options).outerHTML
        case(keys.DROPDOWN_ELEMENT):
            return compileDropdownHTML(options).outerHTML
        case(keys.FORM_ELEMENT):
        case(keys.EMAIL_ELEMENT):
        case(keys.PHONE_ELEMENT):
        case(keys.LONG_FORM_ELEMENT):
            return compileFormHTML(options).outerHTML
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
    // const compiledAlert = compileAlertHTML({ surveyId })
    
    const {stages, styles} = surveyOptions
    let compiledStages = []
    stages.map((stage, stageIndex) => {
        const compiledStage = compileStage({
            stage, stageIndex, ...surveyOptions
        })
        compiledStages.push(compiledStage)
    })
    
    let css = await compileCSS(surveyOptions)
    css = await cleanCSS(css)
    
    return {
        css, 
        stages: compiledStages, 
        frame: frameHTML, 
        font: styles.font,
        page: '',
        button: '',
        alert: '',
        settings: {}
    }
}

module.exports = {
    compiler, 
    compileElement, 
    compileStage
}