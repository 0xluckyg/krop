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

function setExitCount(element, count) {
    count > 0 ? element.setAttribute(keys.EXIT, count) : null
}

function implementAction(options) {
    let {element, buildId, actionType, postAction, toStage, link, attribute} = options
    attribute = attribute ? attribute : 'onclick'
    switch(actionType) {
        case(keys.SHOW_ACTION):
            element.setAttribute(attribute, `showWidget(${buildId})`)
            return element
        case(keys.SUBMIT_ACTION):
            let postSubmit;
            switch(postAction) {
                case(keys.TO_NEXT_ACTION):
                    postSubmit = 'nextStage'; break;
                case(keys.TO_PREVIOUS_ACTION):
                    postSubmit = 'previousStage'; break;
                case(keys.CLOSE_ACTION):
                    postSubmit = 'closeWidget'; break;
                default:
                    postSubmit = 'closeWidget'; break;
            }
            
            element.setAttribute(attribute, `submitForm(${buildId}, ${postSubmit})`)
            return element
        case(keys.CLOSE_ACTION):
            element.setAttribute(attribute, `closeWidget(${buildId})`)
            return element
        case(keys.TO_NEXT_ACTION):
            element.setAttribute(attribute, `nextStage(${buildId})`)
            return element
        case(keys.TO_PREVIOUS_ACTION):
            element.setAttribute(attribute, `previousStage(${buildId})`)
            return element
        case(keys.TO_STAGE_ACTION):
            element.setAttribute(attribute, `toStage(${buildId}, ${toStage})`)
            return element
        case(keys.TO_LINK_ACTION):
            element.setAttribute(attribute, `window.open('${link}', '_blank')`)
            return element
        default:
            return element
    }
}

function createId(options) {
    const {type, buildId, stageIndex, elementIndex} = options
    let id = `${keys.APP_NAME}__${type}`
    id = (buildId || buildId === 0) ? id + `__b${buildId}` : id
    id = (stageIndex || stageIndex === 0) ? id + `__s${stageIndex}` : id
    id = (elementIndex || elementIndex === 0) ? id + `__${elementIndex}` : id
    
    return id
}

function createElementTypeClass(options) {
    const {type, buildId} = options
    let id = `${keys.APP_NAME}__${type}`
    id = (buildId || buildId === 0) ? id + `__b${buildId}` : id
    
    return id
}

function setStyles(element, styles) {
    Object.keys(styles).forEach(function(key) {
        element.style.setProperty(key, styles[key])
    });
    return element
}

function getCSS(identifier, styles, selector) {
    selector = (selector) ? selector : '.'
    let css = `${selector}${identifier} {
        ${
            Object.keys(styles).map(function(key) {
                return `${key}: ${styles[key]};`
            }).join(' ')
        }
    }`
    return css
}

function getMobileCSS(identifier, styles, selector) {
    selector = (selector) ? selector : '.'
    const mediaQuery = `@media (max-width : ${768}px)`
    let css = `${selector}${identifier} {
        ${
            Object.keys(styles).map(function(key) {
                return `${key}: ${styles[key]};`
            }).join(' ')
        }
    }`
    css = mediaQuery + `{
        ${css}
    }`
    return css
}


module.exports = {
    setStyles, 
    getCSS, 
    getMobileCSS, 
    createId, 
    createElementTypeClass,
    implementAction, 
    setExitCount,
    cleanCSS
}