const jsdom = require("jsdom");

const keys = require('../../../config/keys')
const {compileMainboard} = require('./mainboard')
const {compileText} = require('./text')
const {compileBox} = require('./box')
const {compileImage} = require('./image')
const {compileVideo} = require('./video')
const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')

function compileElement(options) {
    const {element, elementIndex} = options
    switch(element.type) {
        case(keys.MAINBOARD_ELEMENT):
            return compileMainboard({element})
        case(keys.TEXT_ELEMENT):
            return compileText({element, elementIndex})
        case(keys.IMAGE_ELEMENT):
            return compileImage({element, elementIndex})
        case(keys.BOX_ELEMENT):
            return compileBox({element, elementIndex})
        case(keys.VIDEO_ELEMENT):
            return compileVideo({element, elementIndex})
        default:
            return null
    }
}


function compileBanner(options) {    
    let css = ''
    const compiledMainboard = compileElement({
        element: options.mainboard
    })
    css += compiledMainboard.css
    let mainboardHTML = compiledMainboard.html
    
    options.elements.map((element, i) => {
        const elementIndex = options.elements.length - i
        const compiledElement = compileElement({
            element, 
            elementIndex
        })
        css += compiledElement.css
        mainboardHTML.appendChild(compiledElement.html)
    })
        
    return {css, html: mainboardHTML}
}

async function compiler(widgetOptions) {
    let css = ''
    let html = ''

    const compiledMainboard = compileBanner({...widgetOptions})
    css = compiledMainboard.css
    html = compiledMainboard.html.outerHTML
    
    var options = { 
        compatibility: 'ie8',
        level: 2
    };
    
    let crossBrowserCss = await postcss([ autoprefixer ]).process(css)
    css = crossBrowserCss.css
    css = new CleanCSS(options).minify(css).styles;
    return {css, html}
}

module.exports = {
    compiler, 
    compileElement, 
}