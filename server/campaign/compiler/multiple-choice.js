const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const mcStyles = require('../../../shared/campaign-styles/multiple-choice')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

const optionContainerClass = createClassName({
    type: 'option_container',
    uid: shortid.generate()
})
const optionWrapperClass = createClassName({
    type: 'option_wrapper',
    uid: shortid.generate()
})
const optionRadioClass = createClassName({
    type: 'option_radio',
    uid: shortid.generate()
})


function compileMultipleChoiceHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.MULTIPLE_CHOICE_ELEMENT)
    container.setAttribute('required', element.required)
    container.setAttribute('tags', element.tags.join(','))
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)
    
    element.options.map(option => {
        let optionContainer = document.createElement('div');
        optionContainer.setAttribute('class', optionContainerClass)
        
        let optionWrapper = document.createElement('label');
        optionWrapper.setAttribute('class', optionWrapperClass)
        
        let optionRadio = document.createElement('input');
        optionRadio.setAttribute('class', optionRadioClass)
        optionRadio.setAttribute('value', option.text)
        optionRadio.setAttribute('type', 'radio')
        optionRadio.setAttribute('name', element.id)
        
        let optionText = document.createElement('p');
        optionText.setAttribute('class', textClass)
        optionText.innerHTML = option.text
        
        optionWrapper.appendChild(optionRadio)
        optionWrapper.appendChild(optionText)
        optionContainer.appendChild(optionWrapper)
        container.appendChild(optionContainer)
    })

    return container
}

function compileMultipleChoiceCSS(options) {
    let optionContainerCSS = getCSS(optionContainerClass, {
        ...mcStyles.OPTION_CONTAINER
    })
    let optionContainerHoverCSS = getCSS(optionContainerClass+":hover", {
        ...mcStyles.OPTION_CONTAINER.HOVER
    })
    let optionContainerActiveCSS = getCSS(optionContainerClass+":active", {
        ...mcStyles.OPTION_CONTAINER.ACTIVE
    })
    
    let optionWrapperCSS = getCSS(optionWrapperClass, {
        ...mcStyles.OPTION_WRAPPER
    })
    
    const {primaryColor} = options.styles
    let optionRadioCSS = getCSS(optionRadioClass, {
        ...mcStyles.RADIO
    })
    let optionRadioBeforeCSS = getCSS(optionRadioClass+"::before", {
        borderColor: primaryColor,
        ...mcStyles.RADIO.BEFORE
    })
    let optionRadioAfterCSS = getCSS(optionRadioClass+"::after", {
        ...mcStyles.RADIO.AFTER
    })
    let optionRadioFocusCSS = getCSS(optionRadioClass+":focus", {
        ...mcStyles.RADIO.FOCUS
    })
    let optionRadioCheckeCSS = getCSS(optionRadioClass+":checked", {
        ...mcStyles.RADIO.CHECKED
    })
    let optionRadioCheckedAfterCSS = getCSS(optionRadioClass+":checked::after", {
        backgroundColor: primaryColor,
        ...mcStyles.RADIO.CHECKED_AFTER
    })
    
    return optionContainerCSS
    +optionContainerHoverCSS
    +optionContainerActiveCSS
    +optionWrapperCSS
    +optionRadioCSS
    +optionRadioBeforeCSS
    +optionRadioAfterCSS
    +optionRadioFocusCSS
    +optionRadioCheckedAfterCSS
}

module.exports = {compileMultipleChoiceHTML, compileMultipleChoiceCSS}