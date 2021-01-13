const keys = require('../../../config/keys')
const shortid = require('shortid')

function createId(type) {
    return type + "_" + shortid.generate()
}

const loyalty = (custom) => {
    const {reset, rewards, stamp} = custom ? custom : {}
    return {
        id: createId(keys.LOYALTY_ELEMENT),
        type: keys.LOYALTY_ELEMENT,
        name: 'Loyalty',
        reset: reset ? reset : null,
        rewards: rewards ? rewards : {},
        stamp: stamp ? stamp : null
    }
}

const referral = (custom) => {
    const {required, media, buttonText, question, 
        couponTitle, couponDescription, couponImage, storeAddress, couponDuration } = custom ? custom : {}
    return {
        id:  createId(keys.REFERRAL_ELEMENT),
        type: keys.REFERRAL_ELEMENT,
        name: 'Referral',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Referral',
        buttonText: buttonText ? buttonText : 'Tell friends about this store!',
        
        couponTitle: couponTitle ? couponTitle : '10% DISCOUNT COUPON AT UNDERDOG',
        couponImage: couponImage ? couponImage : '',
        couponDescription: couponDescription ? couponDescription : 'Show this coupon at the following Krop branch below to get a 10% discount on your sandwich',
        storeAddress: storeAddress ? storeAddress : '110 Broadway, NYC',
        couponDuration:  couponDuration ? couponDuration : 10
    }
}

const share = (custom) => {
    const {required, media, platforms, question, tags} = custom ? custom : {}
    return {
        id:  createId(keys.SHARE_ELEMENT),
        type: keys.SHARE_ELEMENT,
        name: 'Share',
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : 'Share',
        platforms: platforms ? platforms : ['facebook', 'instagram', 'twitter'],
        tags: tags ? tags : []
    }
}

const multipleChoice = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.MULTIPLE_CHOICE_ELEMENT),
        type: keys.MULTIPLE_CHOICE_ELEMENT,
        name: 'Multiple Choice',
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1',
        }, {
            text: 'Option 2',
        }],
        tags: tags ? tags : []
    }
}

const checkbox = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.CHECKBOX_ELEMENT),
        type: keys.CHECKBOX_ELEMENT,
        name: 'Checkbox',
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : 'Question',
        options: options ? options : [{
            text: 'Option 1',
        }, {
            text: 'Option 2',
        }],
        tags: tags ? tags : []
    }
}

const dropdown = (custom) => {
    const {required, media, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.DROPDOWN_ELEMENT),
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
        id:  createId(keys.SLIDER_ELEMENT),
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
        id:  createId(keys.FORM_ELEMENT),
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
    const {required, media, maxChar, minChar, tags} = custom ? custom : {}
    return {
        id:  createId(keys.EMAIL_ELEMENT),
        type: keys.EMAIL_ELEMENT,
        name: 'Email',
        required: required ? required : true,
        media: media ? media : null,
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const phone = (custom) => {
    const {required, media, maxChar, minChar, numOnly, tags} = custom ? custom : {}
    return {
        id:  createId(keys.PHONE_ELEMENT),
        type: keys.PHONE_ELEMENT,
        name: 'Phone',
        required: required ? required : true,
        media: media ? media : null,
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        numOnly: numOnly ? numOnly : false,
        tags: tags ? tags : []
    }
}

const address = (custom) => {
    const {media, maxChar, minChar, tags} = custom ? custom : {}
    return {
        id:  createId(keys.ADDRESS_ELEMENT),
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
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const name = (custom) => {
    const {required, media, maxChar, minChar, tags} = custom ? custom : {}
    return {
        id:  createId(keys.NAME_ELEMENT),
        type: keys.NAME_ELEMENT,
        name: 'Name',
        required: required ? required : true,
        media: media ? media : null,
        maxChar: maxChar ? maxChar : 100,
        minChar: minChar ? minChar : 1,
        tags: tags ? tags : []
    }
}

const longForm = (custom) => {
    const {required, media, question, maxChar, minChar, tags} = custom ? custom : {}
    return {
        id:  createId(keys.LONG_FORM_ELEMENT),
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
        id:  createId(keys.HEADING_ELEMENT),
        type: keys.HEADING_ELEMENT,
        name: 'Heading',
        text: text ? text : 'Heading'
    }
}

const subheading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id:  createId(keys.SUBHEADING_ELEMENT),
        type: keys.SUBHEADING_ELEMENT,
        name: 'Subheading',
        text: text ? text : 'Subheading'
    }
}

const paragraph = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id:  createId(keys.PARAGRAPH_ELEMENT),
        type: keys.PARAGRAPH_ELEMENT,
        name: 'Paragraph',
        text: text ? text : 'Paragraph'
    }
}

const image = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.IMAGE_ELEMENT),
        type: keys.IMAGE_ELEMENT,
        name: 'Image',
        url: url ? url : '',
        rounding: true
    }
}

const video = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.VIDEO_ELEMENT),
        type: keys.VIDEO_ELEMENT,
        name: 'Video',
        url: url ? url : '',
        rounding: true
    }
}

const link = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.LINK_ELEMENT),
        type: keys.LINK_ELEMENT,
        name: 'Link',
        url: url ? url : process.env.APP_URL,
        newWindow: true
    }
}

const spacing = (custom) => {
    const {space} = custom ? custom : {}
    return {
        id:  createId(keys.SPACING_ELEMENT),
        type: keys.SPACING_ELEMENT,
        name: 'Spacing',
        space: space ? space : 1
    }
}

const defaultStages = () => [
    {
        settings: {
            id: createId(keys.STAGE_ELEMENT),
            name: 'Questions',
            isSinglePage: true
        },
        elements: [
            // referral(),
            // share(),
            loyalty(),
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
            id: createId(keys.STAGE_ELEMENT),
            name: 'Thank you',
            questionPerPage: true,
            saveStage: false
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

const defaultAlertMessages = () => {
    return {
        required: 'This form is required!',
        tooLong: 'Please keep your {{TYPE}} shorter than {{NUMBER}} characters.',
        tooShort: 'Please make your {{TYPE}} longer than {{NUMBER}} characters.',
        invalid: 'Your {{TYPE}} is invalid!',
        popup: 'Please fix the form errors'
    }
}

module.exports = {
    defaultStages, 
    defaultStyles, 
    defaultAlert,
    multipleChoice, 
    referral,
    share,
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
    spacing,
    loyalty,
    defaultAlertMessages
}