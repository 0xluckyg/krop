const keys = require('../../../config/keys')
const shortid = require('shortid')

function getPosition(x, y, width, height, anchorX, anchorY, widthType, heightType, rotate, aspectRatio, scale) {
    return {
        x: x ? x : 0,
        y: y ? y : 0,
        width: width ? width : 100,
        height: height ? height : 50,
        xAnchor: anchorX ? anchorX : 'left',
        yAnchor: anchorY ? anchorY : 'top',
        widthType: widthType ? widthType : 'px',
        heightType: heightType ? heightType : 'px',
        rotate: rotate ? rotate : [0,0,0],
        aspectRatio: aspectRatio ? aspectRatio : false,
        scale: scale ? scale : 1
    }
}

function getStyle(color, opacity, cornerRounding, borderColor, borderWidth, padding, shadowColor, shadow) {
    return {
        color: color ? color : '#fff',
        opacity: opacity ? opacity : 1,
        cornerRounding: cornerRounding ? cornerRounding : [0,0,0,0],
        borderColor: borderColor ? borderColor : '#fff',
        borderWidth: borderWidth ? borderWidth : [0,0,0,0],
        padding: padding ? padding : [0,0,0,0],
        shadowColor: shadowColor ? shadowColor : '#000',
        shadow: shadow ? shadow : [0,0,0,0]
    }
}


let text = (x,y, width, height) => {
    return {
        type: keys.TEXT_ELEMENT,
        name: 'Text',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 300, height ? height : 70)},
        style: {...getStyle('rgba(0,0,0,0)', 1, [0,0,0,0], 'rgba(0,0,0,0)', [0,0,0,0], [0,0,0,0])},
        // rich text editor (font, heading, bold, italic, underline, list, link, left, center, right)
        html: '<div style="font-size: 24px; text-align: center;"><font face="helvetica">Enter your text here</font></div>',
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 300, 70)
        }
    }
}

let image = (x,y, width, height) => {
    return {
        type: keys.IMAGE_ELEMENT,
        name: 'Image',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 200)},
        style: {
            cornerRounding: [0,0,0,0],
            borderColor: '',
            borderWidth: [0,0,0,0],
            opacity: 1,
            shadow: [0,0,0,0],
            rotate: [0,0,0],
            shadowColor: '#000'
        },
        empty: true,
        //image, svg
        imageType: keys.IMAGE_PROPERTY,
        image: '',
        svg: '',
        //action (link)
        action: '',
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let box = (x,y, width, height) => {
    return {
        type: keys.BOX_ELEMENT,
        name: 'Box',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 200)},
        //style (color, corner rounding, border color, border width, padding)
        style: {...getStyle('#fafafa', 1, [10,10,10,10], '#fff', [0,0,0,0], [0,0,0,0])},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let video = (x,y, width, height) => {
    return {
        type: keys.VIDEO_ELEMENT,
        name: 'Video',
        url: '',
        embedUrl: '',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 200)},
        //style (color, corner rounding, border color, border width, padding)
        style: {...getStyle('#fafafa', 1, [10,10,10,10], '#fff', [0,0,0,0], [0,0,0,0])},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let mainboard = (x, y, width, height) => {
    return {
        type: keys.MAINBOARD_ELEMENT,
        name: 'Mainboard',
        //position (width, height)
        position: {...getPosition(
            x, y, width ? width : 400, height ? height : 600, 'percent', 'percent'
        )},
        //style (color, opacity, cornerRounding, borderColor, borderWidth)
        style: {
            ...getStyle('#fff', 1, [0,0,0,0], '#fff', [0,0,0,0]),
            margin: [0,0,0,0]
        },
        image: '',
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 700, 500, 'percent', 'percent')
        }
    }
}

let defaultBanner = () => {
    return {
        name: 'Default Banner',
        elements: [
            qr(100,100),
            box(0,0), 
            image(20,20),
            video(30,30),
            text(50, 50),
        ],
        mainboard: mainboard(50, 50)
    }
}

module.exports = {
    text, image, box, video, mainboard, defaultBanner
}