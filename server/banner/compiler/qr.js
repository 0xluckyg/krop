const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const qrcode = require('qrcode')
const {getCSS, getContainerStyle, createId} = require('./functions')
const keys = require('../../../config/keys')

async function compileQrHTML(options) {
    const {elementIndex} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let qrContainer = document.createElement('div');
    qrContainer.className = createId({
        type: keys.QR_ELEMENT, 
        elementIndex
    })
    
    const qrData = await qrcode.toDataURL(options.element.value);
    let qrImage = document.createElement('img');
    qrImage.setAttribute('src', qrData)
    qrImage.setAttribute('style', 'width: 100%')

    qrContainer.appendChild(qrImage)

    return qrContainer
}

function getQrStyle(style) {
    const {color, cornerRounding, borderColor, borderWidth, padding, opacity, shadow, shadowColor} = style.style
    const paddingStyle = padding ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px` : null
    const cornerStyle = cornerRounding ? `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px` : null
    const borderStyle = borderWidth ? `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px` : null
    return {
        "background-color": color,
        "border-radius": cornerStyle,
        "border-width": borderStyle,
        "border-style": 'solid',
        "border-color": borderColor,
        "padding": paddingStyle,
        "opacity": opacity,
    }
}

function compileQrCSS(options) {
    const {element, elementIndex} = options
    const id = createId({
        type: keys.QR_ELEMENT, 
        elementIndex,
    })

    let cssString = getCSS(id, {
        ...getContainerStyle({
            element, index: elementIndex
        }),
        ...getQrStyle(element)
    })

    return cssString
}

async function compileQr(options) {
    const qrCSS = compileQrCSS(options)
    const qrHTML = await compileQrHTML(options)
    
    return {css: qrCSS, html: qrHTML}
}

module.exports = {compileQr}