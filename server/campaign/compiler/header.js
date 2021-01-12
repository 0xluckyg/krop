const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const headerStyles = require('../../../shared/campaign-styles/header')

//Frame includes container, wrapper, header, background
const containerId = createId({
    type: keys.HEADER_ELEMENT
})
const containerClass = createClassName({
    type: keys.HEADER_ELEMENT,
    uid: shortid.generate()
})

const titleClass = createClassName({
    type: keys.HEADER_ELEMENT,
    uid: shortid.generate()
})

const logoClass = createClassName({
    type: keys.HEADER_ELEMENT,
    uid: shortid.generate()
})

function compileHeaderHTML(options) {
    const {styles, settings} = options
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let container = document.createElement('div');
    container.setAttribute('id', containerId)
    container.setAttribute('class', containerClass)
    
    if (styles.logo && styles.logo != '') {
        let logo = document.createElement('img');
        logo.setAttribute('src', styles.logo)
        logo.setAttribute('class', logoClass)
        container.appendChild(logo)
    } else {
        let title = document.createElement('h3');
        title.setAttribute('class', titleClass)
        title.innerHTML = settings.name
        container.appendChild(title)
    }

    return container
}

function compileHeaderCSS(options) {
    const {styles} = options
    const {backgroundColor, primaryColor} = styles
    
    let headerCSS = getCSS(containerClass, {
        backgroundColor,
        ...headerStyles.HEADER_CONTAINER
    })
    if (styles.logo && styles.logo != '') { 
        headerCSS += getCSS(logoClass, {
            ...headerStyles.LOGO
        })
    } else {
        headerCSS += getCSS(titleClass, {
            color: primaryColor,
            ...headerStyles.TITLE
        })
    }
    
    return headerCSS
}

module.exports = {compileHeaderHTML, compileHeaderCSS}