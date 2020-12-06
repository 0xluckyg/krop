const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const textStyles = require('../../../shared/survey-styles/text')

const headingClass = createClassName({
    type: keys.HEADING_ELEMENT,
    uid: shortid.generate()
})
const subheadingClass = createClassName({
    type: keys.SUBHEADING_ELEMENT,
    uid: shortid.generate()
})
const paragraphClass = createClassName({
    type: keys.PARAGRAPH_ELEMENT,
    uid: shortid.generate()
})

function compileTextHTML(options) {
    const headingId = createId({
        type: keys.HEADING_ELEMENT
    })
    const subheadingId = createId({
        type: keys.SUBHEADING_ELEMENT
    })
    const paragraphId = createId({
        type: keys.PARAGRAPH_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    switch(element.type) {
        case(keys.HEADING_ELEMENT):
            let heading = document.createElement('h1');
            heading.setAttribute('id', headingId)
            heading.setAttribute('class', headingClass)
            heading.innerHTML = element.text
            return heading
        case(keys.SUBHEADING_ELEMENT):
            let subheading = document.createElement('h3');
            subheading.setAttribute('id', subheadingId)
            subheading.setAttribute('class', subheadingClass)
            subheading.innerHTML = element.text
            return subheading
        case(keys.PARAGRAPH_ELEMENT):
            let paragraph = document.createElement('p');
            paragraph.setAttribute('id', paragraphId)
            paragraph.setAttribute('class', paragraphClass)
            paragraph.innerHTML = element.text
            return paragraph
    }
}

function compileTextCSS(options) {
    const {element, styles} = options
    const {textColor, align} = styles
    
    switch(element.type) {
        case(keys.HEADING_ELEMENT):
            return getCSS(headingClass, {
                color: textColor, textAlign: align,
                ...textStyles.HEADING
            })
        case(keys.SUBHEADING_ELEMENT):

            return getCSS(subheadingClass, {
                color: textColor, textAlign: align,
                ...textStyles.SUBHEADING
            })
        case(keys.PARAGRAPH_ELEMENT):
            return getCSS(paragraphClass, {
                color: textColor, textAlign: align,
                ...textStyles.PARAGRAPH
            })
    }
}

module.exports = {compileTextHTML, compileTextCSS}