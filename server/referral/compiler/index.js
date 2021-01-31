const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const couponStyles = require('../../../shared/campaign-styles/media')

const containerClass = createClassName({
    type: 'container',
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
const imageClass = createClassName({
    type: 'image',
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
    body.setAttribute('class', containerClass)

    let title = document.createElement('p')
    title.setAttribute('class', titleClass)
    title.innerHTML = couponTitle

    let description = document.createElement('p')
    description.setAttribute('class', descriptionClass)
    description.innerHTML = couponDescription

    let image = document.createElement('img')
    image.setAttribute('class', imageClass)
    image.setAttribute('src', couponImage)

    let address = document.createElement('p')
    address.setAttribute('class', addressClass)
    address.innerHTML = storeAddress

    let expiration = document.createElement('p')
    expiration.setAttribute('class', expirationClass)
    expiration.innerHTML = `{{${keys.EXPIRATION_DATE}}}`

    body.appendChild(title)
    body.appendChild(description)
    body.appendChild(image)
    body.appendChild(address)
    body.appendChild(expiration)
    
    return body.outerHTML
}

function compileCouponCSS(options) {
    const { 
        couponBackgroundColor,
        couponTextColor    
    } = options

    let containerCSS = getCSS(containerClass, {
        ...couponStyles.CONTAINER,
        backgroundColor: couponBackgroundColor,
        color: couponTextColor
    })
    let titleCSS = getCSS(titleClass, {
        ...couponStyles.TITLE
    })
    let descriptionCSS = getCSS(descriptionClass, {
        ...couponStyles.DESCRIPTION
    })
    let imageCSS = getCSS(imageClass, {
        ...couponStyles.IMAGE
    })
    let addressCSS = getCSS(addressClass, {
        ...couponStyles.ADDRESS
    })
    let expirationCSS = getCSS(expirationClass, {
        ...couponStyles.EXPIRATION
    })

    return containerCSS+titleCSS+descriptionCSS+imageCSS+addressCSS+expirationCSS 
}

function compileCoupon(options) {
    return {
        html: compileCouponHTML(options),
        css: compileCouponCSS(options)
    }
}

module.exports = {compileCouponHTML, compileCouponCSS, compileCoupon}