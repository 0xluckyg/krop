const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {setStyles, getCSS, getContainerStyle, createId} = require('./functions')

const keys = require('../../../config/keys')

function compileTextHTML(options) {
    const {element, elementIndex} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let textContainer = document.createElement('div');
    textContainer.className = createId({
        type: keys.TEXT_ELEMENT, 
        elementIndex
    })
    
    let textWrapper = document.createElement('div');
    textWrapper = setStyles(textWrapper, {
        'height': '100%',
        'width': '100%',
        'top': '0px',
        'left': '0px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center'
    })
    textWrapper.innerHTML = element.html
    
    textContainer.appendChild(textWrapper)
    
    return textContainer
}

function getTextStyle(style) {
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

function compileTextCSS(options) {
    const {element, elementIndex} = options
    const id = createId({
        type: keys.TEXT_ELEMENT, 
        elementIndex
    })
    
    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: elementIndex
        }),
        ...getTextStyle(element)
    })
    
    return cssString
}

function compileText(options) {
    const textCSS = compileTextCSS(options)
    const textHTML = compileTextHTML(options)
    
    return {css: textCSS, html: textHTML}
}

module.exports = {compileText}