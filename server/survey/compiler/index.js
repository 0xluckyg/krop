const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileBackground} = require('./background')
const {compileAlert} = require('./alert')
const {createId, cleanCSS} = require('./functions')

function compileCSS(options) {
    const {stages, styles} = options
    
    
}

function compileElement(options) {
    const {element, surveyId, stageIndex, elementIndex, stages, surveyOptions} = options
    switch(element.type) {
        case(keys.BACKGROUND):
            return compileBackground({element, surveyId})
        case(keys.ALERT):
            return compileAlert({element, surveyId})
        default:
            return null
    }
}


function compileStage(options) {
    const {stage, surveyId, stageIndex, stages, surveyOptions} = options
    
    const compiledStage = {
        settings: {},
        elements: []
    }
    stage.elements.map((element, i) => {
        const elementIndex = stage.elements.length - i
        const compiledElement = compileElement({
            element, 
            surveyId, 
            stageIndex, 
            elementIndex, 
            stages,
            surveyOptions
        })
        
        compiledStage.elements.push(compiledElement)
    })
    
    return compiledStage
}

async function compiler(surveyOptions) {
    const {surveyId, background, alert, styles, stages} = surveyOptions

    const compiledBg = compileElement({
        element: background, surveyId
    })
    let backgroundHtml = compiledBg.html.outerHTML

    const compiledAlert = compileElement({
        element: alert, surveyId
    })
    let alertHtml = compiledAlert.html.outerHTML

    let compiledStages = []
    stages.map((stage, stageIndex) => {
        const compiledStage = compileStage({
            stage, surveyId, stageIndex, stages, surveyOptions
        })
        compiledStages.push(compiledStage)
    })
    
    let css = compileCSS({stages, styles})
    css = await cleanCSS(css)
    
    return {
        css, 
        stages: compiledStages, 
        background: backgroundHtml, 
        alert: alertHtml
    }
}

module.exports = {
    compiler, 
    compileElement, 
    compileStage
}