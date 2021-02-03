const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const couponStyles = require('../../../shared/campaign-styles/coupon')

const bodyClass = createClassName({
    type: 'body',
    uid: shortid.generate()
})
const containerClass = createClassName({
    type: 'container',
    uid: shortid.generate()
})
const wrapperClass = createClassName({
    type: 'wrapper',
    uid: shortid.generate()
})
const dividerClass = createClassName({
    type: 'divider',
    uid: shortid.generate()
})
const lineClass = createClassName({
    type: 'line',
    uid: shortid.generate()
})
const circleClass = createClassName({
    type: 'circle',
    uid: shortid.generate()
})
const circleLeftClass = createClassName({
    type: 'circleLeft',
    uid: shortid.generate()
})
const circleRightClass = createClassName({
    type: 'circleRight',
    uid: shortid.generate()
})
const imageClass = createClassName({
    type: 'image',
    uid: shortid.generate()
})
const titleClass = createClassName({
    type: 'title',
    uid: shortid.generate()
})
const descriptionClass = createClassName({
    type: 'description',
    uid: shortid.generate()
})
const addressClass = createClassName({
    type: 'address',
    uid: shortid.generate()
})
const expirationClass = createClassName({
    type: 'expiration',
    uid: shortid.generate()
})

function compileCouponHTML(options) {
    const { 
        couponTitle,
        couponImage,
        couponDescription,
        storeAddress 
    } = options

    const dom = new JSDOM('')
    const document = dom.window.document

    let body = document.createElement('body')
    body.setAttribute('class', bodyClass)

    let container = document.createElement('div')
    container.setAttribute('class', containerClass)

    if (couponImage) {
        let image = document.createElement('img')
        image.setAttribute('class', imageClass)
        image.setAttribute('src', couponImage)
        container.appendChild(image)
    }

    let wrapper = document.createElement('div')
    wrapper.setAttribute('class', wrapperClass)

    let title = document.createElement('p')
    title.setAttribute('class', titleClass)
    title.innerHTML = couponTitle
    wrapper.appendChild(title)

    let expiration = document.createElement('p')
    expiration.setAttribute('class', expirationClass)
    expiration.innerHTML = `{{${keys.EXPIRATION_DATE}}}`
    wrapper.appendChild(expiration)

    let divider = document.createElement('div')
    divider.setAttribute('class', dividerClass)
    let line = document.createElement('div')
    line.setAttribute('class', lineClass)
    let circleLeft = document.createElement('div')
    circleLeft.setAttribute('class', `${circleClass} ${circleLeftClass}`)
    let circleRight = document.createElement('div')
    circleRight.setAttribute('class', `${circleClass} ${circleRightClass}`)
    divider.appendChild(circleLeft)
    divider.appendChild(line)
    divider.appendChild(circleRight)
    wrapper.appendChild(divider)

    let address = document.createElement('p')
    address.setAttribute('class', addressClass)
    address.innerHTML = storeAddress
    wrapper.appendChild(address)

    let description = document.createElement('p')
    description.setAttribute('class', descriptionClass)
    description.innerHTML = couponDescription
    wrapper.appendChild(description)

    container.appendChild(wrapper)
    
    return body.outerHTML
}

function compileCouponCSS(options) {
    const { 
        primaryColor
    } = options

    let bodyCSS = getCSS(bodyClass, {
        ...couponStyles.BODY,
    })

    let containerCSS = getCSS(containerClass, {
        ...couponStyles.CONTAINER,
    })

    let wrapperCSS = getCSS(wrapperClass, {
        ...couponStyles.WRAPPER,
        borderTop: `solid 3px ${primaryColor}`
    })

    let dividerCSS = getCSS(dividerClass, {
        ...couponStyles.DIVIDER,
    })

    let lineCSS = getCSS(lineClass, {
        ...couponStyles.LINE,
    })

    let circleCSS = getCSS(circleClass, {
        ...couponStyles.CIRCLE,
    })

    let circleLeftCSS = getCSS(circleLeftClass, {
        ...couponStyles.CIRCLE_LEFT,
    })

    let circleRightCSS = getCSS(circleRightClass, {
        ...couponStyles.CIRCLE_RIGHT,
    })

    let imageCSS = getCSS(imageClass, {
        ...couponStyles.IMAGE,
    })

    let titleCSS = getCSS(titleClass, {
        ...couponStyles.TITLE,
    })

    let descriptionCSS = getCSS(descriptionClass, {
        ...couponStyles.DESCRIPTION,
    })

    let addressCSS = getCSS(addressClass, {
        ...couponStyles.ADDRESS,
    })

    let expirationCSS = getCSS(expirationClass, {
        ...couponStyles.EXPIRATION,
    })

    return bodyCSS+
    containerCSS+
    wrapperCSS+
    dividerCSS+
    lineCSS+
    circleCSS+
    circleLeftCSS+
    circleRightCSS+
    imageCSS+
    titleCSS+
    descriptionCSS+
    addressCSS+
    expirationCSS
}

function compileCoupon(options) {
    return {
        html: compileCouponHTML(options),
        css: compileCouponCSS(options)
    }
}

module.exports = {compileCouponHTML, compileCouponCSS, compileCoupon}