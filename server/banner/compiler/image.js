const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {getCSS, getContainerStyle, getMobileCSS, getMobileContainerStyle, createId, setExitCount} = require('./functions')
const keys = require('../../../config/keys')

function compileImageHTML(options) {
    const {element, elementIndex} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    const className = createId({
        type: keys.IMAGE_ELEMENT,
        elementIndex
    })
    
    if (!element.imageType || element.imageType == keys.IMAGE_ELEMENT) {
        let imgElement = document.createElement('img');
        imgElement.className = className
        imgElement.src = element.image   
        return imgElement
    } else {
        let svgElement = document.createElement('svg');
        svgElement.className = className
        svgElement.innerHTML = element.svg
        return svgElement
    }
}

function getImageStyle(style) {
    const {cornerRounding, borderColor, borderWidth, padding, opacity, shadow, shadowColor} = style.style
    const paddingStyle = padding ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px` : null
    const cornerStyle = cornerRounding ? `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px` : null
    const borderStyle = borderWidth ? `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px` : null
    const shadowStyle = (shadow && shadowColor) ? `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}` : null

    return {
        "border-radius": cornerStyle,
        "border-width": borderStyle,
        "border-style": 'solid',
        "border-color": borderColor,
        "padding": paddingStyle,
        "opacity": opacity,
        "box-shadow": shadowStyle
        
    }
}

function compileImageCSS(options) {
    const {element, elementIndex} = options
    const id = createId({
        type: keys.IMAGE_ELEMENT, 
        elementIndex
    })
    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: elementIndex
        }),
        ...getImageStyle(element)
    })

    return cssString
}

function compileImage(options) {
    const imageCSS = compileImageCSS(options)
    const imageHTML = compileImageHTML(options)
    
    return {css: imageCSS, html: imageHTML}
}

module.exports = {compileImage}