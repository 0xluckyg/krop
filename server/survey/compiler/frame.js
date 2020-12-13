
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const {compileHeaderHTML, compileHeaderCSS} = require('../compiler/header')
const keys = require('../../../config/keys')
const frameStyles = require('../../../shared/survey-styles/frame')

//Frame includes container, wrapper, header, background, page
const backgroundId = createId({
    type: keys.BACKGROUND_ELEMENT
})
const backgroundClass = createClassName({
    type: keys.BACKGROUND_ELEMENT,
    uid: shortid.generate()
})

const wrapperId = createId({
    type: keys.WRAPPER_ELEMENT
})
const wrapperClass = createClassName({
    type: keys.WRAPPER_ELEMENT,
    uid: shortid.generate()
})

const containerId = createId({
    type: keys.CONTAINER_ELEMENT
})
const containerClass = createClassName({
    type: keys.CONTAINER_ELEMENT,
    uid: shortid.generate()
})

function compileFrameHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document

    let background = document.createElement('div');
    background.setAttribute('id', backgroundId)
    background.setAttribute('class', backgroundClass)

    let wrapper = document.createElement('div');
    wrapper.setAttribute('id', wrapperId)
    wrapper.setAttribute('class', wrapperClass)
    wrapper.appendChild(background)
    
    let header = compileHeaderHTML(options)
    
    let container = document.createElement('div');
    container.setAttribute('id', containerId)
    container.setAttribute('class', containerClass)
    container.appendChild(header)
    container.appendChild(wrapper)

    return container
}

function compileFrameCSS(options) {
    let headerCSS = compileHeaderCSS(options)
    
    let htmlCSS = getCSS('html *', { 
        fontFamily: options.styles.font,
        '-webkitTapHighlightColor': 'rgba(0,0,0,0)'
    }, "")
    
    let bodyCSS = getCSS('body', { margin: 0 }, "")
    
    let containerCSS = getCSS(containerClass, {
        ...frameStyles.SURVEY_CONTAINER
    })
    let wrapperCSS = getCSS(wrapperClass, {
        ...frameStyles.SURVEY_WRAPPER
    })
    let backgroundCSS = getCSS(backgroundClass, {
        ...frameStyles.BACKGROUND
    })
    
    const css = htmlCSS+bodyCSS+headerCSS+containerCSS+wrapperCSS+backgroundCSS
    return css
}

module.exports = {compileFrameHTML, compileFrameCSS}