function getAspectRatioDimensions(ratio, width, height, widthType, heightType, parent) {
    if (width) {
        if (widthType == 'percent') {
            width = dimensionToPx(parent.parentWidth, width)
        }
        height = Math.round(width / ratio * 10) / 10
    } else if (height) {
        if (heightType == 'percent') {
            height = dimensionToPx(parent.parentWidth, height)
        }
        width = Math.round(ratio * height * 10) / 10
    }
    
    if (heightType == 'percent') height = dimensionToPercent(parent.parentHeight, height)
    if (widthType == 'percent') width = dimensionToPercent(parent.parentWidth, width)
    
    return {width, height}
}

function convertAnchorPx(bgSize, elmSize, elmPosition) {
    let px = Number(bgSize) - (Number(elmPosition) + Number(elmSize))
    px = Math.round(px * 10) / 10
    return px
}

function positionToPercent(bgSize, elmSize, px) {
    let full = bgSize - elmSize
    if (full == 0) return 0
    let percent = (px / full) * 100
    percent = Math.round(percent * 10) / 10
    return percent
}

function positionToPx(bgSize, elmSize, percent) {
    const full = bgSize - elmSize
    let px = full * (percent / 100)
    px = Math.round(px * 10) / 10
    return px
}

function dimensionToPercent(bgSize, elmSize) {
    const dToP = Math.round((elmSize / bgSize * 100) * 10) / 10
    return dToP
}

function dimensionToPx(bgSize, elmSize) {
    const dToPx = Math.round((bgSize * (elmSize / 100)) * 10) / 10
    return dToPx
}

function getElementRelativeCenter(parentWidth, parentHeight, elementWidth, elementHeight) {
    const centerX = positionToPx(parentWidth, elementWidth, 50)
    const centerY = positionToPx(parentHeight, elementHeight, 50)
    
    return {x: centerX, y: centerY}
}

module.exports = {getAspectRatioDimensions, positionToPercent, positionToPx, dimensionToPercent, dimensionToPx, convertAnchorPx, getElementRelativeCenter}