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

function getTextStyle(label, size, font, color) {
    return {
        label: label ? label : '',
        size: size ? size : 0,
        font: font ? font : '',
        color: color ? color : '#fff'
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


//MAIN DEFAULT ELEMENTS

//todo: ADD HTML EDITOR
let text = (x,y, width, height) => {
    return {
        type: keys.TEXT,
        name: 'Text',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 300, height ? height : 70)},
        style: {...getStyle('rgba(0,0,0,0)', 1, [0,0,0,0], 'rgba(0,0,0,0)', [0,0,0,0], [0,0,0,0])},
        // rich text editor (font, heading, bold, italic, underline, list, link, left, center, right)
        html: '<div style="font-size: 24px; text-align: center;"><font face="helvetica">Enter your text here</font></div>',
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 300, 70)
        }
    }
}

let button = (x,y, width, height) => {
    return {
        type: keys.BUTTON,
        name: 'Button',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 180, height ? height : 45)},
        //style (color, cornerRounding, borderColor, borderWidth)
        style: {...getStyle(keys.APP_COLOR, 1, [30,30,30,30], '#fff', [0,0,0,0], [0,0,0,0])},
        
        //image, html, svg
        buttonType: keys.HTML_PROPERTY,
        html: `<div style="font-size: 20px; color: white; text-align: center;">Button</div>`,
        image: '',
        svg: '',
        //action type (submit, link, next, close, previous)
        actionType: keys.SUBMIT_ACTION,
        postSubmit: keys.TO_NEXT_ACTION,
        toStage: false,
        action: '',
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 180, 45)
        }
    }
}

let form = (x,y, width, height) => {
    return {
        type: keys.FORM,
        name: 'Form',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 300, height ? height : 45)},
        //style (color, cornerRounding, borderColor, borderWidth)
        style: {...getStyle('#fafafa', 1, [30,30,30,30], '#fff', [0,0,0,0], [0,0,0,25])},
        //text (label, size, font, color)
        text: {...getTextStyle('', 17, 'Helvetica', '#000')},
        //placeholder (label, size, font, color)
        placeholder: {...getTextStyle('Placeholder', 17, 'Helvetica', keys.APP_COLOR_GRAY_DARKEST)},
        //action type (email, phone)
        actionType: 'email',
        animation: {},
        tags: [],
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 300, 45)
        }
    }
}

let image = (x,y, width, height) => {
    return {
        type: keys.IMAGE,
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
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let box = (x,y, width, height) => {
    return {
        type: keys.BOX,
        name: 'Box',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 200)},
        //style (color, corner rounding, border color, border width, padding)
        style: {...getStyle('#fafafa', 1, [10,10,10,10], '#fff', [0,0,0,0], [0,0,0,0])},
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let html = (x,y, width, height) => {
    return {
        type: keys.HTML,
        name: 'Html',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 100)},
        html: '<span>Enter your code here</span>',
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 100),
        }
    }
}

let video = (x,y, width, height) => {
    return {
        type: keys.VIDEO,
        name: 'Video',
        url: '',
        embedUrl: '',
        //position (width, height)
        position: {...getPosition(x, y, width ? width : 200, height ? height : 200)},
        //style (color, corner rounding, border color, border width, padding)
        style: {...getStyle('#fafafa', 1, [10,10,10,10], '#fff', [0,0,0,0], [0,0,0,0])},
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 200, 200)
        }
    }
}

let share = (x,y, width, height) => {
    return {
        type: keys.SHARE,
        name: 'Share',
        position: {...getPosition(x, y, width ? width : 150, height ? height : 80)},
        buttons: ['facebook', 'twitter', 'tumblr'],
        text: 'Checkout this website!',
        buttonSize: 30,
        url: '',
        style: {...getStyle('#fff', 1, [20,20,20,20], '#fff', [0,0,0,0], [6,6,6,6])},
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 150, 80)
        }
    }
}


let section = (x,y) => {
    return {
        type: keys.SECTION,
        elements: [],
        //position (width, height)
        position: {...getPosition(x, y, 300, 70)},
        style: {...getStyle('rgba(0,0,0,0)', 1, [0,0,0,0], 'rgba(0,0,0,0)', [0,0,0,0], [0,0,0,0])},
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 300, 70)
        }
    }
}

let mainboard = (x, y, width, height) => {
    return {
        type: keys.MAINBOARD,
        name: 'Mainboard',
        //position (width, height)
        overflow: false,
        position: {...getPosition(
            x, y, width ? width : 700, height ? height : 500, 'percent', 'percent'
        )},
        //style (color, opacity, cornerRounding, borderColor, borderWidth)
        style: {
            ...getStyle('#fff', 1, [0,0,0,0], '#fff', [0,0,0,0]),
            margin: [0,0,0,0]
        },
        image: '',
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x, y, 700, 500, 'percent', 'percent')
        }
    }
}

let background = (color, opacity) => {
    return {
        type: keys.BACKGROUND,
        name: 'Background',
        enabled: true,
        overflow: false,
        //style (color, cornerRounding, borderColor, borderWidth)
        style: {
            color: color ? color : '#fff',
            opacity: opacity ? opacity : 1,
        },
        image: '',
        //action type (next, close, null)
        actionType: null,
        animation: {},
        locked: false
    }
}

let tab = (x, y, xAnchor, yAnchor, width, height) => {
    return {
        type: keys.TAB,
        name: 'Tab',
        enabled: true,
        position: {
            ...getPosition(x, y, width, height, xAnchor, yAnchor)},
        //style (color, cornerRounding, borderColor, borderWidth)
        style: {...getStyle(keys.APP_COLOR, 1, [40,40,40,40], '#fff', [0,0,0,0], [0,0,0,0])},
        //image, html, svg
        tabType: keys.HTML_PROPERTY,
        html: `<div style="width: 100%;"><div style="color: white; text-align: center;"><font style="font-size: 15px;"><b style="">Click Me</b></font></div></div>`,
        //design type (hidden, basic, corner, floating)
        image: '',
        svg: '',
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x,y, width, height, 'right', 'bottom')
        }
    }
}

let alertElement = (x, y, xAnchor, yAnchor, width, height) => {
    return {
        type: keys.ALERT,
        name: 'Alert',
        duration: 3,
        position: {...getPosition(x, y, width, height, 'percent', 'bottom')},
        // style: color, opacity, cornerRounding, borderColor, borderWidth, padding, shadowColor, shadow
        style: {...getStyle(keys.APP_COLOR, 1, [5,5,5,5], '#fff', [0,0,0,0], [10,10,10,10])},
        text: {...getTextStyle('Alert Example', 15, 'Helvetica', '#fff')},
        //design type (hidden, basic, corner, floating)
        animation: {},
        locked: false,
        mobile: {
            enabled: false,
            ...getPosition(x,y, width, height, 'right', 'bottom')
        }
    }
}

let branding = () => {
    return {
        type: keys.BRANDING,
        name: 'Branding',
        active: true
    }
}

let defaultStage = () => {
    return {
        name: '',
        stageId: shortid.generate(),
        elements: [
            // box(0,0), 
            // text(50, 50),
            // button(100, 100), 
            // form(150, 150), 
            section(200,200),
            // share(0,0)
        ],
        mainboard: mainboard(50, 50)
    }
}

let defaultStyles = () => {
    return {
        background: {...background('rgba(0,0,0,0.03)')}, 
        tab: {...tab(20, 20, 'right', 'bottom', 70, 70)},
        alert: {...alertElement(50, 20, 'percent', 'bottom', 150, 30)}
    }
}

module.exports = {
    section, text, button, form, image, box, html, video, share, mainboard, tab, background, branding, defaultStage, defaultStyles
}