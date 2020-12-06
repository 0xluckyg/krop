const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const checkboxStyles = require('../../../shared/survey-styles/checkbox')
const {textClass, compileElementContainerHTML, compileQuestionHTML, compileAlertTextHTML} = require('./reusable')

const checkboxId = createId({
    type: keys.CHECKBOX_ELEMENT
})
const optionContainerClass = createClassName({
    type: 'option',
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


function compileCheckboxHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', checkboxId)
    
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
        optionRadio.setAttribute('type', 'checkbox')
        optionRadio.setAttribute('name', checkboxId)
        
        let optionText = document.createElement('p');
        optionText.setAttribute('class', textClass)
        optionText.innerHTML = option.text
        
        optionWrapper.appendChild(optionRadio)
        optionWrapper.appendChild(optionText)
        optionContainer.appendChild(optionWrapper)
        container.appendChild(optionContainer)
    })
    
    let alertText = compileAlertTextHTML()
    alertText.innerHTML = 'Example alert'
    container.append(alertText)
    
    return container
}

function compileCheckboxCSS(options) {
    let optionContainerCSS = getCSS(optionContainerClass, {
        ...checkboxStyles.OPTION_CONTAINER
    })
    let optionContainerHoverCSS = getCSS(optionContainerClass+":hover", {
        ...checkboxStyles.OPTION_CONTAINER.HOVER
    })
    let optionContainerActiveCSS = getCSS(optionContainerClass+":active", {
        ...checkboxStyles.OPTION_CONTAINER.ACTIVE
    })
    
    let optionWrapperCSS = getCSS(optionWrapperClass, {
        ...checkboxStyles.OPTION_WRAPPER
    })
    
    const {primaryColor} = options.styles
    let optionRadioCSS = getCSS(optionRadioClass, {
        ...checkboxStyles.RADIO
    })
    let optionRadioBeforeCSS = getCSS(optionRadioClass+"::before", {
        borderColor: primaryColor,
        ...checkboxStyles.RADIO.BEFORE
    })
    let optionRadioAfterCSS = getCSS(optionRadioClass+"::after", {
        ...checkboxStyles.RADIO.AFTER
    })
    let optionRadioFocusCSS = getCSS(optionRadioClass+":focus", {
        ...checkboxStyles.RADIO.FOCUS
    })
    let optionRadioCheckedAfterCSS = getCSS(optionRadioClass+":checked::after", {
        backgroundColor: primaryColor,
        ...checkboxStyles.RADIO.CHECKED_AFTER
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

module.exports = {compileCheckboxHTML, compileCheckboxCSS}