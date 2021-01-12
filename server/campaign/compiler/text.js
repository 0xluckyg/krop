const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const textStyles = require('../../../shared/campaign-styles/text')

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
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    switch(element.type) {
        case(keys.HEADING_ELEMENT):
            let heading = document.createElement('h1');
            heading.setAttribute('id', element.id)
            heading.setAttribute('class', headingClass)
            heading.setAttribute('type', keys.ALERT_ELEMENT)
            heading.innerHTML = element.text
            return heading
        case(keys.SUBHEADING_ELEMENT):
            let subheading = document.createElement('h3');
            subheading.setAttribute('id', element.id)
            subheading.setAttribute('class', subheadingClass)
            subheading.setAttribute('type', keys.SUBHEADING_ELEMENT)
            subheading.innerHTML = element.text
            return subheading
        case(keys.PARAGRAPH_ELEMENT):
            let paragraph = document.createElement('p');
            paragraph.setAttribute('id', element.id)
            paragraph.setAttribute('class', paragraphClass)
            paragraph.setAttribute('type', keys.PARAGRAPH_ELEMENT)
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