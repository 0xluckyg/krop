const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const addressStyles = require('../../../shared/survey-styles/address')
const {textClass, compileElementContainerHTML, compileQuestionHTML, compileAlertTextHTML} = require('./reusable')
const {formClass} = require('./form')

const dom = new JSDOM('')
const document = dom.window.document

const addressTitleClass = createClassName({
    type: 'address_title',
    uid: shortid.generate()
})
const addressWrapperClass = createClassName({
    type: 'address_wrapper',
    uid: shortid.generate()
})
const frontAddressClass = createClassName({
    type: 'front_address',
    uid: shortid.generate()
})
const addressClass = createClassName({
    type: 'address',
    uid: shortid.generate()
})

function compileAddress1(options) {
    const {address1Enabled} = options.element
    if (!address1Enabled) return null
    
    let address1 = document.createElement('input');
    address1.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    address1.setAttribute('placeholder', "Address 1")
    return address1
}

function compileAddress2(options) {
    const {address2Enabled} = options.element
    if (!address2Enabled) return null
    
    let address2 = document.createElement('input');
    address2.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    address2.setAttribute('placeholder', "Address 2")
    return address2
}

function compileCity(options) {
    const {cityEnabled, stateEnabled} = options.element
    if (!cityEnabled) return null
    
    const frontAddress = stateEnabled ? frontAddressClass : ""
    let city = document.createElement('input');
    city.setAttribute('class',  frontAddress + " " + textClass + " " + addressClass + " " + formClass)
    city.setAttribute('placeholder', "City")
    return city
}

function compileState(options) {
    const {stateEnabled} = options.element
    if (!stateEnabled) return null
    
    let state = document.createElement('input');
    state.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    state.setAttribute('placeholder', "State")
    return state
}

function compileCountry(options) {
    const {address1Enabled, zipEnabled} = options.element
    if (!address1Enabled) return null
    
    const frontAddress = zipEnabled ? frontAddressClass : ""
    let country = document.createElement('input');
    country.setAttribute('class',  frontAddress + " " + textClass + " " + addressClass + " " + formClass)
    country.setAttribute('placeholder', "Country")
    return country
}

function compileZip(options) {
    const {zipEnabled} = options.element
    if (!zipEnabled) return null
    
    let zip = document.createElement('input');
    zip.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    zip.setAttribute('placeholder', "Zip")
    return zip
}

function compileAddressHTML(options) {
    const nameId = createId({
        type: keys.NAME_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options

    let container = compileElementContainerHTML()
    container.setAttribute('id', nameId)
    container.setAttribute('type', element.type)
    
    let question = compileQuestionHTML()
    let newClass = question.getAttribute("class") + " " + addressTitleClass
    question.setAttribute('class', newClass)
    question.innerHTML = "Address"
    container.appendChild(question)
    
    //------------
    
    let address1 = compileAddress1(options)
    if (address1) container.appendChild(address1)
    
    let address2 = compileAddress2(options)
    if (address2) container.appendChild(address2)
    
    //------------
    
    let addressWrapper1 = document.createElement('div')
    addressWrapper1.setAttribute('class', addressWrapperClass)
    
    let city = compileCity(options)
    if (city) addressWrapper1.appendChild(city)
    
    let state = compileState(options)
    if (state) addressWrapper1.appendChild(state)
    
    if (city && state) container.appendChild(addressWrapper1)
    
    //------------
    
    let addressWrapper2 = document.createElement('div')
    addressWrapper2.setAttribute('class', addressWrapperClass)
    
    let country = compileCountry(options)
    if (country) addressWrapper2.appendChild(country)
    
    let zip = compileZip(options)
    if (zip) addressWrapper2.appendChild(zip)
    
    if (country && zip) container.appendChild(addressWrapper2)

    //------------

    let alertText = compileAlertTextHTML()
    alertText.innerHTML = 'Example alert'
    container.appendChild(alertText)
    
    return container
}

function compileAddressCSS(options) {
    const {textColor} = options.styles
    
    let addressTitleCSS = getCSS(addressTitleClass, {
        ...addressStyles.ADDRESS_TITLE
    })
    let addressWrapperCSS = getCSS(addressWrapperClass, {
        ...addressStyles.ADDRESS_WRAPPER
    })
    let frontAddressCSS = getCSS(frontAddressClass, {
        ...addressStyles.FRONT_ADDRESS
    })
    let addressCSS = getCSS(addressClass, {
        ...addressStyles.ADDRESS
    })

    return addressTitleCSS + addressWrapperCSS + frontAddressCSS + addressCSS
    
}

module.exports = {compileAddressHTML, compileAddressCSS}