const keys = require('../../../config/keys')
const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer')
const sliderCompiler = require('postcss-input-range')
const postcss = require('postcss')

async function cleanCSS(css) {
    var options = { 
        compatibility: 'ie8',
        level: 2
    };
    let crossBrowserCss = await postcss([ 
        autoprefixer,
        sliderCompiler()
    ]).process(css)
    css = crossBrowserCss.css
    css = new CleanCSS(options).minify(css).styles;
    
    return css
}

function implementAction(options) {
    let {element, actionType, toPage, toStage, link, attribute} = options
    attribute = attribute ? attribute : 'onclick'
    switch(actionType) {
        case(keys.TO_NEXT_PAGE_ACTION):
            element.setAttribute(attribute, `nextPage()`)
            return element
        case(keys.TO_NEXT_STAGE_ACTION):
            element.setAttribute(attribute, `nextStage()`)
            return element
        case(keys.TO_PREVIOUS_PAGE_ACTION):
            element.setAttribute(attribute, `previousPage()`)
            return element
        case(keys.TO_PREVIOUS_STAGE_ACTION):
            element.setAttribute(attribute, `previousStage()`)
            return element
        case(keys.SUBMIT_ACTION):
            element.setAttribute(attribute, `submitSurvey()`)
            return element
        case(keys.TO_PAGE_ACTION):
            element.setAttribute(attribute, `toPage(${toPage})`)
            return element
        case(keys.TO_STAGE_ACTION):
            element.setAttribute(attribute, `toStage(${toStage})`)
            return element
        case(keys.TO_LINK_ACTION):
            element.setAttribute(attribute, `window.open('${link}', '_blank')`)
            return element
        default:
            return element
    }
}

function createId(options) {
    const {type, stageIndex, elementIndex} = options
    let id = `${keys.APP_NAME}__${type}`
    id = (stageIndex || stageIndex === 0) ? id + `__s${stageIndex}` : id
    id = (elementIndex || elementIndex === 0) ? id + `__${elementIndex}` : id
    
    return id
}

function createClassName(options) {
    const {type, uid} = options
    return `${keys.APP_NAME}__${type}__${uid}`
}

function setStyles(element, styles) {
    Object.keys(styles).forEach(function(key) {
        element.style.setProperty(key, styles[key])
    });
    return element
}

function getCSS(identifier, styles, selector) {
    styles = Object.keys(styles).reduce((acc, key) => {
        if (typeof styles[key] !== 'object') {
            return acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + styles[key] + ';'   
        }
    }, '');
    
    selector = (selector) ? selector : '.'
    let css = `${selector}${identifier} {${styles}}`
    return css
}

function getDesktopCSS(identifier, styles, selector) {
    styles = Object.keys(styles).reduce((acc, key) => {
        if (typeof styles[key] !== 'object') {
            return acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + styles[key] + ';'   
        }
    }, '');
    
    selector = (selector) ? selector : '.'
    const mediaQuery = `@media (min-width : ${768}px)`
    let css = `${selector}${identifier} {${styles}}`
    css = mediaQuery + `{${css}}`
    return css
}


module.exports = {
    setStyles, 
    getCSS, 
    getDesktopCSS, 
    createId, 
    createClassName,
    implementAction, 
    cleanCSS
}