const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const spacingStyles = require('../../../shared/survey-styles/spacing')

const spacingClass = createClassName({
    type: keys.SPACING_ELEMENT,
    uid: shortid.generate()
})

function compileSpacingHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let spacing = document.createElement('div');
    spacing.setAttribute('id', options.element.id)
    spacing.setAttribute('class', spacingClass)
    spacing.setAttribute('type', keys.SPACING_ELEMENT)
    
    return spacing
}

function compileSpacingCSS(options) {
    let height = spacingStyles.SPACING.height * options.element.space
    let spacingCSS = getCSS(spacingClass, {
        height,
        ...spacingStyles.SPACING
    })
    
    return spacingCSS 
    
}

module.exports = {compileSpacingHTML, compileSpacingCSS}