const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const formStyles = require('../../../shared/survey-styles/form')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

const formClass = createClassName({
    type: 'input',
    uid: shortid.generate()
})

function getQuestion(element) {
    const placeholders = {}
    placeholders[keys.EMAIL_ELEMENT] = 'Email'
    placeholders[keys.PHONE_ELEMENT] = 'Phone'
    placeholders[keys.FORM_ELEMENT] = element.question
    placeholders[keys.LONG_FORM_ELEMENT] = element.question

    return placeholders[element.type]
}

function getPlaceholder(element) {
    const placeholders = {}
    placeholders[keys.EMAIL_ELEMENT] = 'Email'
    placeholders[keys.PHONE_ELEMENT] = 'Phone number'
    placeholders[keys.FORM_ELEMENT] = 'Please put your answer here'
    placeholders[keys.LONG_FORM_ELEMENT] = 'Please put your answer here'

    return placeholders[element.type]
}

function compileFormHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    element.type
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.FORM_ELEMENT)
    
    let question = compileQuestionHTML()
    question.innerHTML = getQuestion(element)
    container.appendChild(question)
    
    let input = document.createElement('input');
    input.setAttribute('class', textClass + " " + formClass)
    input.setAttribute('placeholder', getPlaceholder(element))
    container.appendChild(input)

    return container
}

function compileFormCSS(options) {
    const {textColor} = options.styles
    
    let formCSS = getCSS(formClass, {
        ...formStyles.FORM,
        color: textColor,
        borderColor: textColor
    })
    let formFocusCSS = getCSS(formClass+":focus", {
        ...formStyles.FORM.FOCUS
    })
    let formPlaceholderCSS = getCSS(formClass+"::placeholder", {
        ...formStyles.FORM.PLACEHOLDER,
        color: textColor
    })

    return formCSS+formFocusCSS+formPlaceholderCSS 
}

module.exports = {compileFormHTML, compileFormCSS, formClass}