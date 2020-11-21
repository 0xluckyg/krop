const keys = require('../../../config/keys')
const shortid = require('shortid')

const multipleChoice = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        type: keys.MULTIPLE_CHOICE_ELEMENT,
        name: 'Multiple Choice',
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1',
            media: null
        }, {
            text: 'Option 2',
            media: null
        }],
        tags: tags ? tags : []
    }
}

const checkbox = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        type: keys.CHECKBOX_ELEMENT,
        name: 'Checkbox',
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1',
            media: null
        }, {
            text: 'Option 2',
            media: null
        }],
        tags: tags ? tags : []
    }
}

const dropdown = (custom) => {
    const {required, media, question, options, tags} = custom ? custom : {}
    return {
        type: keys.DROPDOWN_ELEMENT,
        name: 'Dropdown',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1',
            media: null
        }, {
            text: 'Option 2',
            media: null
        }],
        tags: tags ? tags : []
    }
}

const slider = (custom) => {
    const {required, media, question, min, max, tags} = custom ? custom : {}
    return {
        type: keys.SLIDER_ELEMENT,
        name: 'Slider',
        required: required ? required : true,
        media: media ? media : null,
        min: min ? min : 0,
        max: max ? max : 10,
        question: question ? question : 'Question',
        tags: tags ? tags : []
    }
}

const form = (custom) => {
    const {required, media, question, maxChar, minChar, numOnly, tags} = custom ? custom : {}
    return {
        type: keys.FORM_ELEMENT,
        name: 'Form',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        numOnly: numOnly ? numOnly : false,
        tags: tags ? tags : []
    }
}

const email = (custom) => {
    const {required, media, question, maxChar, minChar, tags} = custom ? custom : {}
    return {
        type: keys.EMAIL_ELEMENT,
        name: 'Email',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const phone = (custom) => {
    const {required, media, question, maxChar, minChar, numOnly, tags} = custom ? custom : {}
    return {
        type: keys.PHONE_ELEMENT,
        name: 'Phone',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        numOnly: numOnly ? numOnly : false,
        tags: tags ? tags : []
    }
}

const address = (custom) => {
    const {required, media, question, maxChar, minChar, tags} = custom ? custom : {}
    return {
        type: keys.ADDRESS_ELEMENT,
        name: 'Address',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const name = (custom) => {
    const {required, media, question, maxChar, minChar, tags} = custom ? custom : {}
    return {
        type: keys.NAME_ELEMENT,
        name: 'Name',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const longForm = (custom) => {
    const {required, media, question, maxChar, minChar, tags} = custom ? custom : {}
    return {
        type: keys.LONGFORM_ELEMENT,
        name: 'Long Form',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const heading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        type: keys.HEADING_ELEMENT,
        name: 'Heading',
        text: text ? text : ''
    }
}

const subheading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        type: keys.SUBHEADING_ELEMENT,
        name: 'Subheading',
        text: text ? text : ''
    }
}

const paragraph = (custom) => {
    const {text} = custom ? custom : {}
    return {
        type: keys.PARAGRAPH_ELEMENT,
        name: 'Paragraph',
        text: text ? text : ''
    }
}

const media = (custom) => {
    const {url} = custom ? custom : {}
    return {
        type: keys.MEDIA_ELEMENT,
        name: 'Media',
        url: url ? url : ''
    }
}

const link = (custom) => {
    const {url} = custom ? custom : {}
    return {
        type: keys.LINK_ELEMENT,
        name: 'Link',
        url: url ? url : ''
    }
}

const defaultStages = () => [
    {
        settings: {
            name: 'Questions',
            isSinglePage: true
        },
        elements: [
            subheading(),
            multipleChoice(),
            checkbox(),
            form(),
        ]
    },
    {
        settings: {
            name: 'Thank you',
            isSinglePage: true
        },
        elements: [
            heading(),
            subheading(),
            media(),
            paragraph()
        ]
    }
]

const defaultStyles = () => {
    return {
        logo: null,
        backgroundColor: '#fff',
        backgroundImage: null,
        primaryColor: keys.APP_COLOR,
        secondaryColor: keys.APP_COLOR_GRAY,
        textColor: '#000',
        align: 'center',
        font: 'helvetica'
    }
}

const defaultAlert = () => {
    return {
        backgroundColor: '#fff',
        textColor: '#000',
        popupTextColor: '#000',
        align: 'center',
    }
}

module.exports = {
    defaultStages, 
    defaultStyles, 
    defaultAlert,
    multipleChoice, 
    checkbox, 
    dropdown, 
    slider, 
    form, 
    email, 
    phone, 
    address, 
    name, 
    longForm, 
    heading, 
    subheading, 
    paragraph, 
    media, 
    link
}