const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const mediaStyles = require('../../../shared/survey-styles/media')

const imageClass = createClassName({
    type: keys.IMAGE_ELEMENT,
    uid: shortid.generate()
})

function compileImageHTML(options) {
    const imageId = createId({
        type: keys.IMAGE_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let link = document.createElement('img');
    link.setAttribute('id', imageId)
    link.setAttribute('class', imageClass)
    link.setAttribute('src', element.url)
    link.innerHTML = element.url
    
    return link
}

function compileImageCSS(options) {
    let borderRadius = options.element.rounding ? '20px' : '0px'
    let imageCSS = getCSS(imageClass, {
        borderRadius,
        ...mediaStyles.IMAGE
    })

    return imageCSS 
}

module.exports = {compileImageHTML, compileImageCSS}