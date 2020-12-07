const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const spacingStyles = require('../../../shared/survey-styles/spacing')

const spacingClass = createClassName({
    type: keys.SPACING_ELEMENT,
    uid: shortid.generate()
})

function compileSpacingHTML(options) {
    const spacingId = createId({
        type: keys.SPACING_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    let spacing = document.createElement('div');
    spacing.setAttribute('id', spacingId)
    spacing.setAttribute('class', spacingClass)
    
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