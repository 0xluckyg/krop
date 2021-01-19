const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('./functions')
const keys = require('../../../config/keys')
const shareStyles = require('../../../shared/campaign-styles/share')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')
const socialIcons = require('../../../static/campaign/social-icons')

let strings = {
    en:{
        facebhookShareLabel: "Share on Facebook!",
        instagramShareLabel: "Share on Instagram!",
        twitterShareLabel: "Share on Twitter!"
    },
    kr: {
        facebhookShareLabel: "페이스북에 공유하기!",
        instagramShareLabel: "인스타에 공유하기!",
        twitterShareLabel: "트위터에 공유하기!"
    }
}
strings = {...strings[process.env.LANGUAGE]}

const shareTitleClass = createClassName({
    type: 'share_title',
    uid: shortid.generate()
})
const shareButtonClass = createClassName({
    type: 'share_button',
    uid: shortid.generate()
})
const shareIconClass = createClassName({
    type: 'share_icon',
    uid: shortid.generate()
})
const shareTextClass = createClassName({
    type: 'share_text',
    uid: shortid.generate()
})


function compileShareHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', keys.SHARE_ELEMENT)
    container.setAttribute('tags', element.tags.join(','))
    
    let question = compileQuestionHTML()
    let newClass = question.getAttribute("class") + " " + shareTitleClass
    question.setAttribute('class', newClass)
    question.innerHTML = element.question
    container.appendChild(question)

    const platformText = {
        'facebook': strings.facebhookShareLabel,
        'instagram': strings.instagramShareLabel,
        'twitter': strings.twitterShareLabel
    }

    element.platforms.map(platform => {
        const {svg, color} = socialIcons[platform]
        let buttonContainer = document.createElement('button')
        buttonContainer.style.backgroundColor = color
        buttonContainer.setAttribute('class', shareButtonClass)
        
        let shareIcon = document.createElement('div')
        shareIcon.setAttribute('class', shareIconClass)
        shareIcon.innerHTML = svg

        let shareText = document.createElement('p')
        shareText.setAttribute('class', shareTextClass)
        shareText.innerHTML = platformText[platform]
        
        buttonContainer.appendChild(shareIcon)
        buttonContainer.appendChild(shareText)

        container.appendChild(buttonContainer)
    })

    return container
}

function compileShareCSS(options) {
    let shareTitleCSS = getCSS(shareTitleClass, {
        ...shareStyles.SHARE_TITLE
    })

    const {align} = options.styles
    let textAlign = 'center'
    if (align == 'left') {
        textAlign = 'left'
    } else if (align == 'right') {
        textAlign = 'right'
    }

    let shareButtonCSS = getCSS(shareButtonClass, {
        textAlign,
        ...shareStyles.SHARE_BUTTON
    })

    let shareButtonFocusCSS = getCSS(shareButtonClass + ":focus", {
        ...shareStyles.SHARE_BUTTON.FOCUS
    })

    let shareButtonActiveCSS = getCSS(shareButtonClass + ":active", {
        ...shareStyles.SHARE_BUTTON.ACTIVE
    })

    let shareButtonHoverCSS = getCSS(shareButtonClass + ":hover", {
        ...shareStyles.SHARE_BUTTON.HOVER
    })

    let shareIconCSS = getCSS(shareIconClass, {
        ...shareStyles.SHARE_BUTTON_ICON
    })

    let shareTextCSS = getCSS(shareTextClass, {
        ...shareStyles.SHARE_BUTTON_TEXT
    })

    return shareTitleCSS
    +shareButtonCSS
    +shareButtonFocusCSS
    +shareButtonActiveCSS
    +shareButtonHoverCSS
    +shareIconCSS
    +shareTextCSS
}

module.exports = {compileShareHTML, compileShareCSS}