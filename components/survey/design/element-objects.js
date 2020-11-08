const keys = require('../../../config/keys')
const shortid = require('shortid')

const multipleChoice = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        type: keys.MULTIPLE_CHOICE,
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
        type: keys.CHECKBOX,
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
        type: keys.DROPDOWN,
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
        type: keys.SLIDER,
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
        type: keys.FORM,
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
        type: keys.EMAIL,
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
        type: keys.PHONE,
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
        type: keys.ADDRESS,
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
        type: keys.NAME,
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
        type: keys.LONGFORM,
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
        type: keys.HEADING,
        text: text ? text : ''
    }
}

const subheading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        type: keys.SUBHEADING,
        text: text ? text : ''
    }
}

const paragraph = (custom) => {
    const {text} = custom ? custom : {}
    return {
        type: keys.PARAGRAPH,
        text: text ? text : ''
    }
}

const media = (custom) => {
    const {url} = custom ? custom : {}
    return {
        type: keys.MEDIA,
        url: url ? url : ''
    }
}

const link = (custom) => {
    const {url} = custom ? custom : {}
    return {
        type: keys.MEDIA,
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
        errorColor: 'red',
        align: 'center',
        font: 'helvetica'
    }
}

module.exports = {
    defaultStages, defaultStyles
}