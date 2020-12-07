const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const dropdownStyles = require('../../../shared/survey-styles/dropdown')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

const dropdownWrapperClass = createClassName({
    type: 'dropdown_wrapper',
    uid: shortid.generate()
})
const dropdownClass = createClassName({
    type: 'dropdown',
    uid: shortid.generate()
})
const dropdownOptionClass = createClassName({
    type: 'dropdown_option',
    uid: shortid.generate()
})


function compileDropdownHTML(options) {
    const dropdownId = createId({
        type: keys.DROPDOWN_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', dropdownId)
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)
    
    let dropdownWrapper = document.createElement('div');
    dropdownWrapper.setAttribute('class', dropdownWrapperClass)
    
    let dropdown = document.createElement('select');
    dropdown.setAttribute('class', textClass + " " + dropdownClass)
    
    let defaultOption = document.createElement('option');
    defaultOption.setAttribute('class', dropdownOptionClass)
    defaultOption.innerHTML = "* Please choose an option"
    dropdown.appendChild(defaultOption)
    
    element.options.map(option => {
        let optionElement = document.createElement('option');
        optionElement.setAttribute('class', dropdownOptionClass)
        optionElement.innerHTML = option.text
        dropdown.appendChild(optionElement)
    })
    
    dropdownWrapper.appendChild(dropdown)
    container.appendChild(dropdownWrapper)
    
    return container
}

function compileDropdownCSS(options) {
    const {primaryColor, textColor, backgroundColor} = options.styles
    
    let dropdownWrapperCSS = getCSS(dropdownWrapperClass, {
        ...dropdownStyles.DROPDOWN_WRAPPER
    })
    let dropdownWrapperAfterCSS = getCSS(dropdownWrapperClass+"::after", {
        ...dropdownStyles.DROPDOWN_WRAPPER.AFTER,
        color: primaryColor
    })
    
    let dropdownCSS = getCSS(dropdownClass, {
        ...dropdownStyles.DROPDOWN,
        color: textColor,
        borderColor: textColor
    })
    
    let dropdownOptionCSS = getCSS(dropdownOptionClass, {
        backgroundColor,
        color: textColor
    })
    
    return dropdownWrapperCSS 
    + dropdownWrapperAfterCSS
    + dropdownCSS
    + dropdownOptionCSS
}

module.exports = {compileDropdownHTML, compileDropdownCSS}