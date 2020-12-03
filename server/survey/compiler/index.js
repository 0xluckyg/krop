const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keys = require('../../../config/keys')
const {compileFrameCSS, compileFrameHTML} = require('./frame')
// const {compileAlert} = require('./alert')
const {createId, cleanCSS} = require('./functions')

async function compileCSS(options) {
    const {stages, styles} = options
    let css = compileFrameCSS({styles})
    return await cleanCSS(css)
}

function compileElement(options) {
    const {element, styles, stageIndex, elementIndex, surveyOptions} = options
    switch(element.type) {
        
        
        default:
            return null
    }
}


function compileStage(options) {
    const {stage, styles, stageIndex, surveyOptions} = options
    
    const compiledStage = {
        settings: {},
        elements: []
    }
    stage.elements.map((element, i) => {
        const elementIndex = stage.elements.length - i
        const compiledElement = compileElement({
            element, 
            styles,
            stageIndex, 
            elementIndex, 
            surveyOptions
        })
        
        compiledStage.elements.push(compiledElement)
    })
    
    return compiledStage
}

async function compiler(surveyOptions) {
    const {styles, stages} = surveyOptions
    const frameHTML = compileFrameHTML({styles, surveyOptions}).outerHTML
    // const compiledAlert = compileAlertHTML({ surveyId })
    
    let compiledStages = []
    stages.map((stage, stageIndex) => {
        const compiledStage = compileStage({
            stage, styles, stageIndex, surveyOptions
        })
        compiledStages.push(compiledStage)
    })
    
    let css = await compileCSS({stages, styles})
    return {
        css, 
        stages: compiledStages, 
        frame: frameHTML, 
        // alert: alertHtml
        // button: 
    }
}

module.exports = {
    compiler, 
    compileElement, 
    compileStage
}