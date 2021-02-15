const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const dropdownStyles = require('../../../shared/campaign-styles/dropdown')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

let strings = {
    us:{
        optionPlaceholder: "* Please choose an option"
    },
    kr: {
        optionPlaceholder: "* 옵션을 선택해 주세요"
    }
}
strings = {...strings[process.env.LANGUAGE]}

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
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.DROPDOWN_ELEMENT)
    container.setAttribute('required', element.required)
    container.setAttribute('tags', element.tags.join(','))
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)
    
    let dropdownWrapper = document.createElement('div');
    dropdownWrapper.setAttribute('class', dropdownWrapperClass)
    
    let dropdown = document.createElement('select');
    dropdown.setAttribute('class', textClass + " " + dropdownClass)
    
    let defaultOption = document.createElement('option');
    defaultOption.setAttribute('class', dropdownOptionClass)
    defaultOption.innerHTML = strings.optionPlaceholder
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