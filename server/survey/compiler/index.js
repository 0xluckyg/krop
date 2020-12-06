const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileFrameCSS, compileFrameHTML} = require('./frame')
// const {compileAlert} = require('./alert')
const {compileMultipleChoiceCSS, compileMultipleChoiceHTML} = require('./multiple-choice')
const {compileCheckboxCSS, compileCheckboxHTML} = require('./checkbox')
const {compileQuestionCSS, compileElementContainerCSS, compileAlertTextCSS, compileGeneralTextCSS} = require('./reusable')
const {compileTextCSS, compileTextHTML} = require('./text')
const {createId, cleanCSS, createClassName, getCSS} = require('./functions')

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
                    case(keys.MULTIPLE_CHOICE_ELEMENT):
                        elementCSS = compileMultipleChoiceCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.CHECKBOX_ELEMENT):
                        elementCSS = compileCheckboxCSS({
                            stage, stageIndex, element, elementIndex,
                            ...options
                        })
                        break;
                    case(keys.HEADING_ELEMENT):
                    case(keys.SUBHEADING_ELEMENT):
                    case(keys.PARAGRAPH_ELEMENT):
                        elementCSS = compileTextCSS({
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
        case(keys.MULTIPLE_CHOICE_ELEMENT):
            return compileMultipleChoiceHTML(options).outerHTML
        case(keys.CHECKBOX_ELEMENT):
            return compileCheckboxHTML(options).outerHTML
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
        font: styles.font
        // alert: alertHtml
        // button: 
    }
}

module.exports = {
    compiler, 
    compileElement, 
    compileStage
}