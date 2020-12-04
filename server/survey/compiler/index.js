const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileFrameCSS, compileFrameHTML} = require('./frame')
// const {compileAlert} = require('./alert')
const {createId, cleanCSS} = require('./functions')

async function compileCSS(options) {
    let css = compileFrameCSS(options)
    return await cleanCSS(css)
}

function compileElement(options) {
    const {stage, element, stageIndex, elementIndex} = options
    switch(element.type) {
        
        
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
        
        compiledStage.elements.push(compiledElement)
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