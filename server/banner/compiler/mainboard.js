const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {getCSS, getContainerStyle, createId} = require('./functions')
const keys = require('../../../config/keys')

function getMainboardStyle(style) {
    const overflow = style.overflow ? null : 'hidden'
    const {color, cornerRounding, opacity, shadow, shadowColor, padding, margin} = style.style
    const mainboardImage = (style.image != '') ? `url(${style.image})` : 'none'
    const cornerStyle = cornerRounding ? `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px` : null
    const paddingStyle = padding ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px` : null
    const marginStyle = margin ? `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px` : null
    const shadowStyle = (shadow && shadowColor) ? `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}` : null
    return {
        "overflow": overflow,
        "background-image": mainboardImage,
        "background-repeat": 'no-repeat',
        "background-size": 'cover',
        "background-color": color,
        "border-radius": cornerStyle,
        "padding": paddingStyle,
        "margin": marginStyle,
        "opacity": opacity,
        "box-shadow": shadowStyle,
        "z-index": 9999999,
        "position": 'fixed'
    }
}

function compileMainboardHTML() {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let mainboard = document.createElement('div');
    mainboard.className = createId({
        type: keys.MAINBOARD_ELEMENT, 
    })
    
    return mainboard
}

function compileMainboardCSS(options) {
    const {element, stageIndex} = options
    const id = createId({
        type: keys.MAINBOARD_ELEMENT, 
        stageIndex
    })
        
    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: 0
        }),
        ...getMainboardStyle({...element})
    })
    
    return cssString
}

function compileMainboard(options) {
    const mainboardCSS = compileMainboardCSS(options)
    const mainboardHTML = compileMainboardHTML(options)
    console.log(": ", {mainboardCSS, mainboardHTML})
    return {html: mainboardHTML, css: mainboardCSS}
}

module.exports = {compileMainboard}