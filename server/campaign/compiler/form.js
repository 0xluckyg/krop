const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const formStyles = require('../../../shared/campaign-styles/form')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

let strings = {
    en:{
        emailPlaceholder: "Email",
        phonePlaceholder: "Phone",
        phoneNumberPlaceholder: "Phone number",
        answerPlaceholder: "Please put your answer here",
    },
    kr: {
        emailPlaceholder: "이메일",
        phonePlaceholder: "번호",
        phoneNumberPlaceholder: "전화번호",
        answerPlaceholder: "이곳에 답변을 입력해 주세요",
    }
}
strings = {...strings[process.env.LANGUAGE]}

const formClass = createClassName({
    type: 'input',
    uid: shortid.generate()
})

function getQuestion(element) {
    const placeholders = {}
    placeholders[keys.EMAIL_ELEMENT] = strings.emailPlaceholder
    placeholders[keys.PHONE_ELEMENT] = strings.phonePlaceholder
    placeholders[keys.FORM_ELEMENT] = element.question

    return placeholders[element.type]
}

function getPlaceholder(element) {
    const placeholders = {}
    placeholders[keys.EMAIL_ELEMENT] = strings.emailPlaceholder
    placeholders[keys.PHONE_ELEMENT] = strings.phoneNumberPlaceholder
    placeholders[keys.FORM_ELEMENT] = strings.answerPlaceholder

    return placeholders[element.type]
}

function compileFormHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', element.type)
    container.setAttribute('required', element.required)
    container.setAttribute('tags', element.tags.join(','))
    container.setAttribute('min', element.minChar)
    container.setAttribute('max', element.maxChar)
    container.setAttribute('num', element.numOnly)
    
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