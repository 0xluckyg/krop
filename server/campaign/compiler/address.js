const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const addressStyles = require('../../../shared/campaign-styles/address')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')
const {formClass} = require('./form')

const dom = new JSDOM('')
const document = dom.window.document

let strings = {
    us:{
        address1Placeholder: "Address 1",
        address2Placeholder: "Address 2",
        cityPlaceholder: "City",
        statePlaceholder: "State",
        countryPlaceholder: "Country",
        zipPlaceholder: "Zip",
        addressLabel: "Address"
    },
    kr: {
        address1Placeholder: "주소",
        address2Placeholder: "상세주소",
        cityPlaceholder: "도시",
        statePlaceholder: "도",
        countryPlaceholder: "국가",
        zipPlaceholder: "우편번호",
        addressLabel: "주소"
    }
}
strings = {...strings[process.env.LANGUAGE]}

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
    const {address1Enabled, address1Required} = options.element
    if (!address1Enabled) return null
    
    let address1 = document.createElement('input');
    address1.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    address1.setAttribute('placeholder', strings.address1Placeholder)
    address1.setAttribute('key', "address1")
    address1.setAttribute('required', address1Required)
    return address1
}

function compileAddress2(options) {
    const {address2Enabled, address2Required} = options.element
    if (!address2Enabled) return null
    
    let address2 = document.createElement('input');
    address2.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    address2.setAttribute('placeholder', strings.address2Placeholder)
    address2.setAttribute('key', "address2")
    address2.setAttribute('required', address2Required)
    return address2
}

function compileCity(options) {
    const {cityEnabled, stateEnabled, cityRequired} = options.element
    if (!cityEnabled) return null
    
    const frontAddress = stateEnabled ? frontAddressClass : ""
    let city = document.createElement('input');
    city.setAttribute('class',  frontAddress + " " + textClass + " " + addressClass + " " + formClass)
    city.setAttribute('placeholder', strings.cityPlaceholder)
    city.setAttribute('key', "city")
    city.setAttribute('required', cityRequired)
    return city
}

function compileState(options) {
    const {stateEnabled, stateRequired} = options.element
    if (!stateEnabled) return null
    
    let state = document.createElement('input');
    state.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    state.setAttribute('placeholder', strings.statePlaceholder)
    state.setAttribute('key', "state")
    state.setAttribute('required', stateRequired)
    return state
}

function compileCountry(options) {
    const {countryEnabled, zipEnabled, countryRequired} = options.element
    if (!countryEnabled) return null
    
    const frontAddress = zipEnabled ? frontAddressClass : ""
    let country = document.createElement('input');
    country.setAttribute('class',  frontAddress + " " + textClass + " " + addressClass + " " + formClass)
    country.setAttribute('placeholder', strings.countryPlaceholder)
    country.setAttribute('key', "country")
    country.setAttribute('required', countryRequired)
    return country
}

function compileZip(options) {
    const {zipEnabled, zipRequired} = options.element
    if (!zipEnabled) return null
    
    let zip = document.createElement('input');
    zip.setAttribute('class', textClass + " " + addressClass + " " + formClass)
    zip.setAttribute('placeholder', strings.zipPlaceholder)
    zip.setAttribute('key', "zip")
    zip.setAttribute('required', zipRequired)
    return zip
}

function compileAddressHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {id, minChar, maxChar, tags} = options.element

    let container = compileElementContainerHTML()
    container.setAttribute('id', id)
    container.setAttribute('type', keys.ADDRESS_ELEMENT)
    container.setAttribute('min', minChar)
    container.setAttribute('max', maxChar)
    container.setAttribute('tags', tags.join(','))
    
    let question = compileQuestionHTML()
    let newClass = question.getAttribute("class") + " " + addressTitleClass
    question.setAttribute('class', newClass)
    question.innerHTML = strings.addressLabel
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

    return container
}

function compileAddressCSS(options) {
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