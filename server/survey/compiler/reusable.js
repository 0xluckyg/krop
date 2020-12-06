const shortid = require('shortid')
const jsdom = require("jsdom");

const {createClassName, getCSS} = require('./functions')
const reusableStyles = require('../../../shared/survey-styles/reusable')
const alertStyles = require('../../../shared/survey-styles/alert')
const keys = require('../../../config/keys')

const { JSDOM } = jsdom;
const dom = new JSDOM('')
const document = dom.window.document

const elementContainerClass = createClassName({
    type: 'element_container',
    uid: shortid.generate()
})

const questionClass = createClassName({
    type: 'question',
    uid: shortid.generate()
})
const alertTextClass = createClassName({
    type: 'alert_text',
    uid: shortid.generate()
})
const textClass = createClassName({
    type: 'text',
    uid: shortid.generate()
})

function compileElementContainerHTML(options) {
    let question = document.createElement('div');
    question.setAttribute('class', elementContainerClass)
    return question
}

function compileQuestionHTML(options) {
    let question = document.createElement('p');
    question.setAttribute('class', questionClass)
    return question
}

function compileAlertTextHTML(options) {
    let alertText = document.createElement('p');
    alertText.setAttribute('class', alertTextClass)
    return alertText
}

function compileElementContainerCSS(options) {
    return getCSS(elementContainerClass, {
        ...reusableStyles.CONTAINER
    })
}

function compileQuestionCSS(options) {
    return getCSS(questionClass, {
        ...reusableStyles.QUESTION
    })
}

function compileAlertTextCSS(options) {
    return getCSS(alertTextClass, {
        ...alertStyles.ALERT_TEXT
    })
}

function compileGeneralTextCSS(options) {
    const {textColor} = options.styles
    return getCSS(textClass, {
        ...reusableStyles.TEXT,
        color: textColor
    })
}

module.exports = {
    elementContainerClass,
    questionClass,
    alertTextClass,
    textClass,
    
    compileElementContainerHTML,
    compileQuestionHTML,
    compileAlertTextHTML,
    
    compileElementContainerCSS,
    compileQuestionCSS,
    compileAlertTextCSS,
    compileGeneralTextCSS
}