const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const linkStyles = require('../../../shared/survey-styles/link')

const linkClass = createClassName({
    type: keys.LINK_ELEMENT,
    uid: shortid.generate()
})

function compileLinkHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let link = document.createElement('a');
    link.setAttribute('type', keys.LINK_ELEMENT)
    link.setAttribute('id', element.id)
    link.setAttribute('class', linkClass)
    link.setAttribute('href', element.url)
    link.innerHTML = element.url
    
    return link
}

function compileLinkCSS(options) {
    const {align, primaryColor} = options.styles
    
    let linkCSS = getCSS(linkClass, {
        textAlign: align,
        color: primaryColor,
        ...linkStyles.LINK
    })
    let linkBeforeCSS = getCSS(linkClass+"::before", {
        ...linkStyles.LINK.BEFORE
    })
    let linkHoverCSS = getCSS(linkClass+":hover", {
        ...linkStyles.LINK.HOVER
    })
    let linkActiveCSS = getCSS(linkClass+":active", {
        ...linkStyles.LINK.ACTIVE
    })
    

    return linkCSS 
    + linkBeforeCSS
    + linkHoverCSS
    + linkActiveCSS
    
}

module.exports = {compileLinkHTML, compileLinkCSS}