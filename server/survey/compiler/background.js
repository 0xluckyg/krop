const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const {setStyles, getCSS, createId, setExitCount} = require('../../builder/compiler/functions')
const keys = require('../../../config/keys')

function compileBackgroundHTML(options) {
    const {element, widgetId} = options

    const dom = new JSDOM('')
    const document = dom.window.document
    
    let bgContainer = document.createElement('div');
    bgContainer.className = createId({
        type: keys.BACKGROUND, 
        buildId: widgetId
    })
    
    let bgWrapper = document.createElement('div');
    
    
    bgContainer.appendChild(bgWrapper)
    return bgContainer
}

function compileBackgroundCSS(options) {
    const {element, widgetId} = options
    if (!element.enabled) return false
    
    const {color, opacity} = element.style
    const id = createId({
        type: keys.BACKGROUND, 
        buildId: widgetId
    })
    const backgroundImage = (element.image != '') ? `url(${element.image})` : 'none'
    
    let cssString = getCSS(id, {
        "background-image": backgroundImage,
        "background-repeat": 'no-repeat',
        "background-size": 'cover',
        "background-color": color,
        "height": "100%",
        "width": "100%",
        "position": "fixed",
        "top": 0,
        "left": 0,
        "z-index": 9999999,
        "opacity": opacity,
        "overflow": element.overflow ? 'auto' : 'hidden'
    })

    return cssString
}

function compileBackground(options) {
    const backgroundCSS = compileBackgroundCSS(options)
    const backgroundHTML = compileBackgroundHTML(options)
    setExitCount(backgroundHTML, backgroundCSS.exitCount)

    return {css: backgroundCSS.css, html: backgroundHTML}
}

module.exports = {compileBackground}