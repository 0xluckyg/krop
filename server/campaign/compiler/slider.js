const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer')
const sliderCompiler = require('postcss-input-range')
const postcss = require('postcss')

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')
const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const sliderStyles = require('../../../shared/campaign-styles/slider')

const sliderClass = createClassName({
    type: 'slider',
    uid: shortid.generate()
})

function compileSliderHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.SLIDER_ELEMENT)
    container.setAttribute('required', element.required)
    container.setAttribute('tags', element.tags.join(','))
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)
    
    let sliderInput = document.createElement('input')
    sliderInput.setAttribute('class', sliderClass)
    sliderInput.setAttribute('type', 'range')
    sliderInput.setAttribute('min', element.min)
    sliderInput.setAttribute('max', element.max)
    container.appendChild(sliderInput)
    
    return container
}

function compileSliderCSS(options) {
    const {primaryColor, textColor, backgroundColor} = options.styles
    
    let sliderCSS = getCSS(sliderClass, {
        ...sliderStyles.SLIDER
    })
    let sliderThumbCSS = getCSS(sliderClass +'::range-thumb', {
        ...sliderStyles.SLIDER.THUMB,
        backgroundColor: primaryColor
    })
    let sliderTrackCSS = getCSS(sliderClass +'::range-track', {
        ...sliderStyles.SLIDER.TRACK,
        backgroundColor: textColor
    })
    let sliderFocusCSS = getCSS(sliderClass +':focus', {
        outline: 'none'
    })
    

    return sliderCSS 
    + sliderThumbCSS
    + sliderTrackCSS
    + sliderFocusCSS
}

module.exports = {compileSliderHTML, compileSliderCSS}