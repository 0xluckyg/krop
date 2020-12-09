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
    question.setAttribute('key', 'question')
    return question
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
    textClass,
    
    compileElementContainerHTML,
    compileQuestionHTML,

    compileElementContainerCSS,
    compileQuestionCSS,
    compileGeneralTextCSS
}