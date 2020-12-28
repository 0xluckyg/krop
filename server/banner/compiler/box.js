const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {getCSS, getContainerStyle, createId} = require('./functions')
const keys = require('../../../config/keys')

function compileBoxHTML(options) {
    const {elementIndex} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let boxContainer = document.createElement('div');
    boxContainer.className = createId({
        type: keys.BOX_ELEMENT, 
        elementIndex
    })
    
    return boxContainer
}

function getBoxStyle(style) {
    const {color, cornerRounding, borderColor, borderWidth, padding, opacity, shadow, shadowColor} = style.style
    const paddingStyle = padding ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px` : null
    const cornerStyle = cornerRounding ? `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px` : null
    const borderStyle = borderWidth ? `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px` : null
    const shadowStyle = (shadow && shadowColor) ? `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}` : null
    return {
        "background-color": color,
        "border-radius": cornerStyle,
        "border-width": borderStyle,
        "border-style": 'solid',
        "border-color": borderColor,
        "padding": paddingStyle,
        "opacity": opacity,
        "box-shadow": shadowStyle
    }
}

function compileBoxCSS(options) {
    const {element, elementIndex} = options
    const id = createId({
        type: keys.BOX_ELEMENT, 
        elementIndex,
    })

    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: elementIndex
        }),
        ...getBoxStyle(element)
    })

    return cssString
}

function compileBox(options) {
    const boxCSS = compileBoxCSS(options)
    const boxHTML = compileBoxHTML(options)
    
    return {css: boxCSS, html: boxHTML}
}

module.exports = {compileBox}