const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const frameStyles = require('../../../shared/survey-styles/frame')

const pageClass = createClassName({
    type: keys.PAGE_ELEMENT,
    uid: shortid.generate()
})

function compilePageHTML(options) {
    const pageId = createId({
        type: keys.PAGE_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let page = document.createElement('div');
    page.setAttribute('id', pageId)
    page.setAttribute('class', pageClass)
    
    return page
}

function compilePageCSS(options) {
    let pageCSS = getCSS(pageClass, {
        ...frameStyles.PAGE_WRAPPER
    })

    return pageCSS
}

module.exports = {compilePageHTML, compilePageCSS}