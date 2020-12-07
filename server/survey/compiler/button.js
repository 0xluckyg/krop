const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const mediaStyles = require('../../../shared/survey-styles/button')

const buttonContainerClass = createClassName({
    type: keys.BUTTON_ELEMENT,
    uid: shortid.generate()
})

const buttonClass = createClassName({
    type: 'button',
    uid: shortid.generate()
})

function compileButtonHTML(options) {
    const buttonId = createId({
        type: keys.BUTTON_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('id', buttonId)
    buttonContainer.setAttribute('class', buttonContainerClass)
    
    let button = document.createElement('button');
    button.setAttribute('class', buttonClass)
    button.innerHTML = "Continue"
    
    buttonContainer.appendChild(button)
    
    return buttonContainer
}

function compileButtonCSS(options) {

    const {backgroundColor, primaryColor} = options.styles

    let buttonContainerCSS = getCSS(buttonContainerClass, {
        backgroundColor,
        ...mediaStyles.BUTTON_CONTAINER
    })
    
    let buttonContainerHoverCSS = getCSS(buttonContainerClass + ":hover", {
        ...mediaStyles.BUTTON_CONTAINER.HOVER
    })
    
    let buttonCSS = getCSS(buttonClass, {
        color: primaryColor,
        ...mediaStyles.BUTTON
    })

    let buttonFocusCSS = getCSS(buttonClass + ":focus", {
        ...mediaStyles.BUTTON.FOCUS
    })

    let buttonActiveCSS = getCSS(buttonClass + ":active", {
        ...mediaStyles.BUTTON.ACTIVE
    })

    return buttonContainerCSS 
    + buttonContainerHoverCSS
    + buttonCSS
    + buttonFocusCSS
    + buttonActiveCSS
}

module.exports = {compileButtonHTML, compileButtonCSS}