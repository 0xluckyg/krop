const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const alertStyles = require('../../../shared/survey-styles/alert')

const dom = new JSDOM('')
const document = dom.window.document

const alertContainerClass = createClassName({
    type: keys.ALERT_ELEMENT,
    uid: shortid.generate()
})

const alertClass = createClassName({
    type: 'alert',
    uid: shortid.generate()
})

const alertTextClass = createClassName({
    type: 'alert_text',
    uid: shortid.generate()
})

function compileAlertHTML(options) {
    const alertId = createId({
        type: keys.ALERT_ELEMENT
    })
    
    let alertContainer = document.createElement('div');
    alertContainer.setAttribute('id', alertId)
    alertContainer.setAttribute('type', keys.ALERT_ELEMENT)
    alertContainer.setAttribute('class', alertContainerClass)
    
    let alertText = document.createElement('p');
    alertText.setAttribute('class', alertClass)
    
    alertContainer.appendChild(alertText)
    
    return alertContainer
}

function compileAlertTextHTML(options) {
    let alertText = document.createElement('p');
    alertText.setAttribute('class', alertTextClass)
    return alertText
}

function compileAlertCSS(options) {
    const {backgroundColor, popupTextColor} = options.alert

    let alertContainerCSS = getCSS(alertContainerClass, {
        backgroundColor,
        ...alertStyles.ALERT_POPUP
    })

    let alertCSS = getCSS(alertClass, {
        color: popupTextColor,
        ...alertStyles.ALERT_POPUP_TEXT
    })

    return alertContainerCSS 
    + alertCSS
}

function compileAlertTextCSS(options) {
    return getCSS(alertTextClass, {
        ...alertStyles.ALERT_TEXT
    })
}

module.exports = {compileAlertHTML, compileAlertTextHTML, compileAlertCSS, compileAlertTextCSS}