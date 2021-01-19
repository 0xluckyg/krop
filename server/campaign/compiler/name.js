const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const nameStyles = require('../../../shared/campaign-styles/name')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')
const {formClass} = require('./form')

let strings = {
    en:{
        nameLabel: "Name",
        firstNamePlaceholder: "First name",
        lastNamePlaceholder: "Last name"
    },
    kr: {
        nameLabel: "이름",
        firstNamePlaceholder: "이름",
        lastNamePlaceholder: "성"
    }
}
strings = {...strings[process.env.LANGUAGE]}

const nameWrapperClass = createClassName({
    type: 'name_wrapper',
    uid: shortid.generate()
})
const frontNameClass = createClassName({
    type: 'front_name',
    uid: shortid.generate()
})

function compileNameHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {id, minChar, maxChar, tags, required} = options.element
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', id)
    container.setAttribute('type', keys.NAME_ELEMENT)
    container.setAttribute('min', minChar)
    container.setAttribute('max', maxChar)
    container.setAttribute('tags', tags.join(','))
    
    let question = compileQuestionHTML()
    question.innerHTML = strings.nameLabel
    container.appendChild(question)
    
    let nameWrapper = document.createElement('div');
    nameWrapper.setAttribute('class', nameWrapperClass)
    
    let firstName = document.createElement('input');
    firstName.setAttribute('class', textClass + " " + frontNameClass + " " + formClass)
    firstName.setAttribute('placeholder', strings.firstNamePlaceholder)
    firstName.setAttribute('key', "firstName")
    firstName.setAttribute('required', required)
    nameWrapper.appendChild(firstName)
    
    let lastName = document.createElement('input');
    lastName.setAttribute('class', textClass + " " + formClass)
    lastName.setAttribute('placeholder', strings.lastNamePlaceholder)
    lastName.setAttribute('key', "lastName")
    lastName.setAttribute('required', required)
    nameWrapper.appendChild(lastName)

    container.appendChild(nameWrapper)

    return container
}

function compileNameCSS(options) {
    let nameWrapperCSS = getCSS(nameWrapperClass, {
        ...nameStyles.NAME_WRAPPER
    })
    let frontNameCSS = getCSS(frontNameClass, {
        ...nameStyles.FRONT_NAME
    })
    
    return nameWrapperCSS + frontNameCSS
}

module.exports = {compileNameHTML, compileNameCSS}