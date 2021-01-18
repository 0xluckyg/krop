const keys = require('../../../config/keys')
const shortid = require('shortid')
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        loyaltyLabel: "Loyalty",
        paragraphLabel: "Paragraph",
        headingLabel: "Heading",
        subheadingLabel: "Subheading",
        imageLabel: "Image",
        videoLabel: "Video",
        linkLabel: "Link",
        spacingLabel: "Spacing",
        referralLabel: "Referral",
        shareLabel: "Share",
        multipleChoiceLabel: "Multiple Choice",
        checkboxLabel: "Checkbox",
        formLabel: "Form",
        longFormLabel: "Long Form",
        emailLabel: "Email",
        phoneLabel: "Phone",
        nameLabel: "Name",
        addressLabel: "Address",
        sliderLabel: "Slider",
        dropdownLabel: "Dropdown",

        referralButtonLabel: "Tell friends about this store!",
        referralTitleLabel: "10% DISCOUNT COUPON AT NAME",
        referralDescriptionLabel: "Show this coupon at the following branch below to claim the discount!",
        storeAddressLabel: "110 Broadway, NYC",

        questionLabel: "Question",
        option1Label: "Option 1",
        option2Label: "Option 2",

        formPlaceholder: "Please write your response here",
        stage1NameLabel: "Questions",
        stage2NameLabel: "Thank you",

        requiredAlertLabel: "This form is required!",
        tooLongAlertLabel: "Please keep your {{TYPE}} shorter than {{NUMBER}} characters.",
        tooShortAlertLabel: "Please make your {{TYPE}} longer than {{NUMBER}} characters.",
        invalidAlertLabel: "Your {{TYPE}} is invalid!",
        popupAlertLabel: "Please fix the form error"
        
    },
    kr: {
        loyaltyLabel: "로열티 쿠폰",
        paragraphLabel: "작은 텍스트 (p)",
        headingLabel: "큰 텍스트 (h1)",
        subheadingLabel: "중간 텍스트 (h2)",
        imageLabel: "이미지",
        videoLabel: "비디오",
        linkLabel: "링크",
        spacingLabel: "공간",
        referralLabel: "추천",
        shareLabel: "공유",
        multipleChoiceLabel: "객관식 (멀티플 초이스)",
        checkboxLabel: "체크박스",
        formLabel: "양식",
        longFormLabel: "긴 양식",
        emailLabel: "이메일",
        phoneLabel: "핸드폰 번호",
        nameLabel: "이름",
        addressLabel: "주소",
        sliderLabel: "슬라이더",
        dropdownLabel: "드랍다운 메뉴",

        referralButtonLabel: "친구들에게 공유하고 쿠폰 받아가세요!",
        referralTitleLabel: "10% 할인 쿠폰",
        referralDescriptionLabel: "이 쿠폰을 다음 지점에서 보여주세요.",
        storeAddressLabel: "주소",

        questionLabel: "질문",
        option1Label: "옵션 1",
        option2Label: "옵션 2",

        formPlaceholder: "이곳에 답변을 작성해 주세요",
        stage1NameLabel: "질문들",
        stage2NameLabel: "감사 페이지",

        requiredAlertLabel: "이 양식은 필수에요!",
        tooLongAlertLabel: "{{TYPE}} 을 {{NUMBER}} 보다 짧게 써주세요.",
        tooShortAlertLabel: "{{TYPE}}을 {{NUMBER}} 보다 길게 써주세요.",
        invalidAlertLabel: "{{TYPE}}을 올바르게 작석해 주세요!",
        popupAlertLabel: "오류들을 수정해 주세요!"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

function createId(type) {
    return type + "_" + shortid.generate()
}

const loyalty = (custom) => {
    const {reset, rewards, stamp} = custom ? custom : {}
    return {
        id: createId(keys.LOYALTY_ELEMENT),
        type: keys.LOYALTY_ELEMENT,
        name: strings.loyaltyLabel,
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
        name: strings.referralLabel,
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : strings.referralLabel,
        buttonText: buttonText ? buttonText : strings.referralButtonLabel,
        
        couponTitle: couponTitle ? couponTitle : strings.referralTitleLabel,
        couponImage: couponImage ? couponImage : '',
        couponDescription: couponDescription ? couponDescription : strings,referralDescriptionLabel,
        storeAddress: storeAddress ? storeAddress : strings.storeAddressLabel,
        couponDuration:  couponDuration ? couponDuration : 10
    }
}

const share = (custom) => {
    const {required, media, platforms, question, tags} = custom ? custom : {}
    return {
        id:  createId(keys.SHARE_ELEMENT),
        type: keys.SHARE_ELEMENT,
        name: strings.shareLabel,
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : strings.shareLabel,
        platforms: platforms ? platforms : ['facebook', 'instagram', 'twitter'],
        tags: tags ? tags : []
    }
}

const multipleChoice = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.MULTIPLE_CHOICE_ELEMENT),
        type: keys.MULTIPLE_CHOICE_ELEMENT,
        name: strings.multipleChoiceLabel,
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : strings.questionLabel,
        options: options ? options : [{
            text: strings.option1Label,
        }, {
            text: strings.option2Label,
        }],
        tags: tags ? tags : []
    }
}

const checkbox = (custom) => {
    const {required, media, hasOther, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.CHECKBOX_ELEMENT),
        type: keys.CHECKBOX_ELEMENT,
        name: strings.checkboxLabel,
        required: required ? required : true,
        media: media ? media : null,
        hasOther: hasOther ? hasOther : false,
        question: question ? question : strings.questionLabel,
        options: options ? options : [{
            text: strings.option1Label,
        }, {
            text: strings.option2Label,
        }],
        tags: tags ? tags : []
    }
}

const dropdown = (custom) => {
    const {required, media, question, options, tags} = custom ? custom : {}
    return {
        id:  createId(keys.DROPDOWN_ELEMENT),
        type: keys.DROPDOWN_ELEMENT,
        name: strings.dropdownLabel,
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : strings.questionLabel,
        options: options ? options : [{
            text: strings.option1Label
        }, {
            text: strings.option2Label
        }],
        tags: tags ? tags : []
    }
}

const slider = (custom) => {
    const {required, media, question, min, max, tags} = custom ? custom : {}
    return {
        id:  createId(keys.SLIDER_ELEMENT),
        type: keys.SLIDER_ELEMENT,
        name: strings.sliderLabel,
        required: required ? required : true,
        media: media ? media : null,
        min: min ? min : 0,
        max: max ? max : 10,
        question: question ? question : strings.questionLabel,
        tags: tags ? tags : []
    }
}

const form = (custom) => {
    const {required, media, question, maxChar, minChar, numOnly, tags} = custom ? custom : {}
    return {
        id:  createId(keys.FORM_ELEMENT),
        type: keys.FORM_ELEMENT,
        name: strings.formLabel,
        required: required ? required : true,
        media: media ? media : null,
        placeholder: strings.formPlaceholder,
        question: question ? question : strings.questionLabel,
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
        name: strings.emailLabel,
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
        name: strings.phoneLabel,
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
        name: strings.addressLabel,
        
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
        name: strings.nameLabel,
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
        name: strings.longFormLabel,
        required: required ? required : true,
        media: media ? media : null,
        question: question ? question : strings.questionLabel,
        placeholder: strings.formPlaceholder,
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
        name: strings.headingLabel,
        text: text ? text : strings.headingLabel
    }
}

const subheading = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id:  createId(keys.SUBHEADING_ELEMENT),
        type: keys.SUBHEADING_ELEMENT,
        name: strings.subheadingLabel,
        text: text ? text : strings.subheadingLabel
    }
}

const paragraph = (custom) => {
    const {text} = custom ? custom : {}
    return {
        id:  createId(keys.PARAGRAPH_ELEMENT),
        type: keys.PARAGRAPH_ELEMENT,
        name: strings.paragraphLabel,
        text: text ? text : strings.paragraphLabel
    }
}

const image = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.IMAGE_ELEMENT),
        type: keys.IMAGE_ELEMENT,
        name: strings.imageLabel,
        url: url ? url : '',
        rounding: true
    }
}

const video = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.VIDEO_ELEMENT),
        type: keys.VIDEO_ELEMENT,
        name: strings.videoLabel,
        url: url ? url : '',
        rounding: true
    }
}

const link = (custom) => {
    const {url} = custom ? custom : {}
    return {
        id:  createId(keys.LINK_ELEMENT),
        type: keys.LINK_ELEMENT,
        name: strings.linkLabel,
        url: url ? url : process.env.APP_URL,
        newWindow: true
    }
}

const spacing = (custom) => {
    const {space} = custom ? custom : {}
    return {
        id:  createId(keys.SPACING_ELEMENT),
        type: keys.SPACING_ELEMENT,
        name: strings.spacingLabel,
        space: space ? space : 1
    }
}

const defaultStages = () => [
    {
        settings: {
            id: createId(keys.STAGE_ELEMENT),
            name: strings.stage1NameLabel,
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
            name: strings.stage2NameLabel,
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
        required: strings.requiredAlertLabel,
        tooLong: strings.tooLongAlertLabel,
        tooShort: strings.tooShortAlertLabel,
        invalid: strings.invalidAlertLabel,
        popup: strings.popupAlertLabel
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