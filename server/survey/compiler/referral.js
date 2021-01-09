const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const referralStyles = require('../../../shared/survey-styles/referral')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')
const socialIcons = require('../../../static/survey/social-icons')

const referralButtonClass = createClassName({
    type: 'referral_button',
    uid: shortid.generate()
})
const referralIconClass = createClassName({
    type: 'referral_icon',
    uid: shortid.generate()
})
const referralTextClass = createClassName({
    type: 'referral_text',
    uid: shortid.generate()
})


function compileReferralHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.REFERRAL_ELEMENT)
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)

    let buttonContainer = document.createElement('button')
    buttonContainer.setAttribute('class', referralButtonClass)
    buttonContainer.setAttribute('onclick', 'shareReferralCoupon()')

    let referralIcon = document.createElement('div')
    referralIcon.setAttribute('class', referralIconClass)
    referralIcon.innerHTML = socialIcons.share.svg

    let referralText = document.createElement('p')
    referralText.setAttribute('class', referralTextClass)
    referralText.innerHTML = element.buttonText
    
    buttonContainer.appendChild(referralIcon)
    buttonContainer.appendChild(referralText)

    container.appendChild(buttonContainer)

    return container
}

function compileReferralCSS(options) {
    const {align} = options.styles
    let textAlign = 'center'
    if (align == 'left') {
        textAlign = 'left'
    } else if (align == 'right') {
        textAlign = 'right'
    }

    let referralButtonCSS = getCSS(referralButtonClass, {
        textAlign,
        ...referralStyles.REFERRAL_BUTTON
    })

    let referralButtonFocusCSS = getCSS(referralButtonClass + ":focus", {
        ...referralStyles.REFERRAL_BUTTON.FOCUS
    })

    let referralButtonActiveCSS = getCSS(referralButtonClass + ":active", {
        ...referralStyles.REFERRAL_BUTTON.ACTIVE
    })

    let referralButtonHoverCSS = getCSS(referralButtonClass + ":hover", {
        ...referralStyles.REFERRAL_BUTTON.HOVER
    })

    let referralIconCSS = getCSS(referralIconClass, {
        ...referralStyles.REFERRAL_BUTTON_ICON
    })

    let referralTextCSS = getCSS(referralTextClass, {
        ...referralStyles.REFERRAL_BUTTON_TEXT
    })

    return referralButtonCSS
    +referralButtonFocusCSS
    +referralButtonActiveCSS
    +referralButtonHoverCSS
    +referralIconCSS
    +referralTextCSS
}

module.exports = {compileReferralHTML, compileReferralCSS}