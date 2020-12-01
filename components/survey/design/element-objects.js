const keys = require('../../../config/keys')
const shortid = require('shortid')

const multipleChoice = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        id: shortid.generate(),
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
        id: shortid.generate(),
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
        id: shortid.generate(),
        type: keys.DROPDOWN_ELEMENT,
        name: 'Dropdown',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1'
        }, {
            text: 'Option 2'
        }],
        tags: tags ? tags : []
    }
}

const slider = (custom) => {
    const {required, media, question, min, max, tags} = custom ? custom : {}
    return {
        id: shortid.generate(),
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
        id: shortid.generate(),
        type: keys.FORM_ELEMENT,
        name: 'Form',
        required: required ? required : true,
        media: media ? media : null,
        placeholder: 'Please write your response here',
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
        id: shortid.generate(),
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
        id: shortid.generate(),
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
        id: shortid.generate(),
        type: keys.ADDRESS_ELEMENT,
        name: 'Address',
        
        address1Enabled: true,
        address1Required: true,
        address2Enabled: true,
        address2Required: true,
        countryEnabled: true,
        countryRequired: true,
        stateEnabled: true,
        stateRequired: true,
        cityEnabled: true,
        cityRequired: true,
        zipEnabled: true,
        zipRequired: true,
        
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
        id: shortid.generate(),
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
        id: shortid.generate(),
        type: keys.LONG_FORM_ELEMENT,
        name: 'Long Form',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Question',
        placeholder: 'Please write your response here',
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const heading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.HEADING_ELEMENT,
        name: 'Heading',
        text: text ? text : 'Heading'
    }
}

const subheading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.SUBHEADING_ELEMENT,
        name: 'Subheading',
        text: text ? text : 'Subheading'
    }
}

const paragraph = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.PARAGRAPH_ELEMENT,
        name: 'Paragraph',
        text: text ? text : 'Paragraph'
    }
}

const image = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.IMAGE_ELEMENT,
        name: 'Image',
        url: url ? url : '',
        rounding: true
    }
}

const video = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.VIDEO_ELEMENT,
        name: 'Video',
        url: url ? url : '',
        rounding: true
    }
}

const link = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.LINK_ELEMENT,
        name: 'Link',
        url: url ? url : process.env.APP_URL,
        newWindow: true
    }
}

const spacing = (custom) => {
    const {space} = custom ? custom : {}
    return {
        id: shortid.generate(),
        type: keys.SPACING_ELEMENT,
        name: 'Spacing',
        space: space ? space : 1
    }
}

const defaultStages = () => [
    {
        settings: {
            name: 'Questions',
            isSinglePage: true
        },
        elements: [
            spacing(),
            heading(), 
            subheading(), 
            paragraph(), 
            image(),
            multipleChoice(), 
            checkbox(), 
            dropdown(), 
            slider(), 
            form(), 
            email(), 
            phone(), 
            address(), 
            name(), 
            longForm(), 
            video(),
            link(),
            spacing()
        ]
    },
    {
        settings: {
            name: 'Thank you',
            questionPerPage: true
        },
        elements: [
            heading(),
            subheading(),
            image(),
            video(),
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
        align: 'left',
        font: 'helvetica'
    }
}

const defaultAlert = () => {
    return {
        backgroundColor: 'rgba(255,55,55,1)',
        textColor: 'rgba(255,55,55,1)',
        popupTextColor: '#fff'
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
    image,
    video,
    link,
    spacing
}