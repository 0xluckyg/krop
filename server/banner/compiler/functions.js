const keys = require('../../../config/keys')

function createId(options) {
    const {type, elementIndex} = options
    let id = `${keys.APP_NAME}__${type}`
    id = (elementIndex || elementIndex === 0) ? id + `__${elementIndex}` : id
    
    return id
}

function setStyles(element, styles) {
    Object.keys(styles).forEach(function(key) {
        element.style.setProperty(key, styles[key])
    });
    return element
}

function getContainerStyle(options) {
    const {element, index, templateMode} = options
    let position = {...element.position}
    let {x, y, width, height, xAnchor, yAnchor, widthType, heightType, rotate, scale} = position
    
    let left = (xAnchor == 'left') ? x : null
    const right = (xAnchor == 'right') ? `${x}px` : null
    let top = (yAnchor == 'top') ? y : null
    const bottom = (yAnchor == 'bottom') ? `${y}px` : null
    
    left = (xAnchor == 'percent') ? `${x}%` : `${left}px`
    top = (yAnchor == 'percent') ? `${y}%` : `${top}px`
    width = (widthType == 'percent') ? `${width}%` : `${width}px`
    height = (heightType == 'percent') ? `${height}%` : `${height}px`
    
    let transformX = (xAnchor == 'percent') ? `${-x}%` : '0%'
    let transformY = (yAnchor == 'percent') ? `${-y}%` : '0%'
    let translate = `translate(${transformX}, ${transformY})`
    let scaleStyle = `scale(${scale ? scale : 1})`
    
    const rotateStyle = rotate ? `rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)` : ''

    if (templateMode) {
        left = '50%'
        top = '50%'
        translate=`translate(-50%, -50%)`
    }
    
    const transform = `${translate} ${scaleStyle} ${rotateStyle}`

    return {
        width, height,
        left, right, top, bottom,
        transform,
        position: 'absolute',
        "z-index": index,
        transition: '300ms'
    }
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

module.exports = {setStyles, getContainerStyle, getCSS, createId}