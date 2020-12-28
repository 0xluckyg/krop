const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {getCSS, getContainerStyle, createId} = require('./functions')
const keys = require('../../../config/keys')

function compileVideoHTML(options) {
    const {element, elementIndex} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    
    if (element.embedUrl == '' || !element.embedUrl) {
        let videoElement = document.createElement('div');
        videoElement.className = createId(keys.VIDEO_ELEMENT, elementIndex)
        return videoElement
    } else {
        let videoElement = document.createElement('iframe');
        videoElement.className = createId({
        type: keys.VIDEO_ELEMENT, 
        elementIndex
    })
        videoElement.src = element.embedUrl + '?controls=0&autoplay=1'   
        return videoElement
    }
}

function getVideoStyle(style) {
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

function compileVideoCSS(options) {
    const {element, elementIndex} = options
    const id = createId({
        type: keys.VIDEO_ELEMENT, 
        elementIndex
    })
    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: elementIndex
        }),
        ...getVideoStyle(element)
    })

    return cssString
}

function compileVideo(options) {
    const videoCSS = compileVideoCSS(options)
    const videoHTML = compileVideoHTML(options)
    
    return {css: videoCSS, html: videoHTML}
}

module.exports = {compileVideo}