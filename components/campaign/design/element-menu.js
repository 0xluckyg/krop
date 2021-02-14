import React, {Fragment} from 'react';
import LocalizedStrings from 'react-localization';

const emailValidator = require("email-validator");
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@mdi/react';
import { 
    mdiCheckboxMarkedOutline,
    mdiCheckboxMarkedCircleOutline,
    mdiFormDropdown,
    mdiRayVertex,
    mdiFormTextbox,
    mdiFormTextarea,
    mdiFormatHeader1,
    mdiFormatHeader2,
    mdiFormatParagraph,
    mdiImageOutline,
    mdiLink,
    mdiYoutube,
    mdiArrowExpandVertical,
    mdiTableHeart,
    mdiShareAll,
    mdiShareVariant,
} from '@mdi/js';

import keys from '../../../config/keys'
import SectionHeader from './element-editor/frame/section-header'
import {findElementPageIndex, elementsToPages} from './element-editor/sub/functions'
import elements from './element-objects'

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
        premadeElementsLabel: "Premade elements",
        chooseFromTemplatesLabel: "Choose from templates",
        designElementsLabel: "Design elements",
        shareElementsLabel: "Share elements",
        campaignElementsLabel: "Campaign elements",
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
        premadeElementsLabel: "템플릿",
        chooseFromTemplatesLabel: "템플릿 에서 고르기",
        designElementsLabel: "디자인 요소들",
        shareElementsLabel: "공유 요소들",
        campaignElementsLabel: "캠페인 요소들",
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

const designElements = [
    {
        type: keys.PARAGRAPH_ELEMENT,
        name: strings.paragraphLabel
    }, {
        type: keys.HEADING_ELEMENT,
        name: strings.headingLabel
    }, {
        type: keys.SUBHEADING_ELEMENT,
        name: strings.subheadingLabel
    }, {
        type: keys.IMAGE_ELEMENT,
        name: strings.imageLabel
    }, {
        type: keys.VIDEO_ELEMENT,
        name: strings.videoLabel
    }, {
        type: keys.LINK_ELEMENT,
        name: strings.linkLabel
    }, {
        type: keys.SPACING_ELEMENT,
        name: strings.spacingLabel
    }
]

const shareElements = [
    {
        type: keys.REFERRAL_ELEMENT,
        name: strings.referralLabel
    }, {
        type: keys.SHARE_ELEMENT,
        name: strings.shareLabel
    }
]

const campaignElements = [
    {
        type: keys.MULTIPLE_CHOICE_ELEMENT,
        name: strings.multipleChoiceLabel
    }, {
        type: keys.CHECKBOX_ELEMENT,
        name: strings.checkboxLabel
    }, {
        type: keys.FORM_ELEMENT,
        name: strings.formLabel
    }, {
        type: keys.LONG_FORM_ELEMENT,
        name: strings.longFormLabel
    }, {
        type: keys.EMAIL_ELEMENT,
        name: strings.emailLabel
    }, {
        type: keys.PHONE_ELEMENT,
        name: strings.phoneLabel
    }, {
        type: keys.NAME_ELEMENT,
        name: strings.nameLabel
    }, {
        type: keys.ADDRESS_ELEMENT,
        name: strings.addressLabel
    }, {
        type: keys.SLIDER_ELEMENT,
        name: strings.sliderLabel
    }, {
        type: keys.DROPDOWN_ELEMENT,
        name: strings.dropdownLabel
    }
]

//A pop up to ask users to login or signup
class AddElementModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {

        }
    }
    
    renderIcon(icon) { 
        return (
            <Icon path={icon}
                className={this.props.classes.mainIcon}
                size={0.9}
                color={keys.APP_COLOR_GRAY_DARKEST}
            />
        )
    }
    
    renderMainIcon(type) {
        const {classes} = this.props
        switch(type) {
            case "template":
                return this.renderIcon(mdiTableHeart)
            case keys.SPACING_ELEMENT:
                return this.renderIcon(mdiArrowExpandVertical)
            case keys.REFERRAL_ELEMENT:
                return this.renderIcon(mdiShareAll)
            case keys.SHARE_ELEMENT:
                return this.renderIcon(mdiShareVariant)
            case keys.MULTIPLE_CHOICE_ELEMENT:
                return this.renderIcon(mdiCheckboxMarkedCircleOutline)
            case keys.CHECKBOX_ELEMENT:
                return this.renderIcon(mdiCheckboxMarkedOutline)
            case keys.DROPDOWN_ELEMENT:
                return this.renderIcon(mdiFormDropdown)
            case keys.SLIDER_ELEMENT:
                return this.renderIcon(mdiRayVertex)
            case keys.FORM_ELEMENT:
                return this.renderIcon(mdiFormTextbox)
            case keys.EMAIL_ELEMENT:
                return this.renderIcon(mdiFormTextbox)
            case keys.PHONE_ELEMENT:
                return this.renderIcon(mdiFormTextbox)
            case keys.ADDRESS_ELEMENT:
                return this.renderIcon(mdiFormTextbox)
            case keys.NAME_ELEMENT:
                return this.renderIcon(mdiFormTextbox)
            case keys.LONG_FORM_ELEMENT:
                return this.renderIcon(mdiFormTextarea)
            case keys.HEADING_ELEMENT:
                return this.renderIcon(mdiFormatHeader1)
            case keys.SUBHEADING_ELEMENT:
                return this.renderIcon(mdiFormatHeader2)
            case keys.PARAGRAPH_ELEMENT:
                return this.renderIcon(mdiFormatParagraph)
            case keys.IMAGE_ELEMENT:
                return this.renderIcon(mdiImageOutline)
            case keys.VIDEO_ELEMENT:
                return this.renderIcon(mdiYoutube)
            case keys.LINK_ELEMENT:
                return this.renderIcon(mdiLink)
            default:
                return null
        }
    }
    
    getElement(type) {
        switch(type) {
            case keys.SPACING_ELEMENT:
                return elements.spacing()
            case keys.REFERRAL_ELEMENT:
                return elements.referral()
            case keys.SHARE_ELEMENT:
                return elements.share()
            case keys.MULTIPLE_CHOICE_ELEMENT:
                return elements.multipleChoice()
            case keys.CHECKBOX_ELEMENT:
                return elements.checkbox()
            case keys.DROPDOWN_ELEMENT:
                return elements.dropdown()
            case keys.SLIDER_ELEMENT:
                return elements.slider()
            case keys.FORM_ELEMENT:
                return elements.form()
            case keys.EMAIL_ELEMENT:
                return elements.email()
            case keys.PHONE_ELEMENT:
                return elements.phone()
            case keys.ADDRESS_ELEMENT:
                return elements.address()
            case keys.NAME_ELEMENT:
                return elements.name()
            case keys.LONG_FORM_ELEMENT:
                return elements.longForm()
            case keys.HEADING_ELEMENT:
                return elements.heading()
            case keys.SUBHEADING_ELEMENT:
                return elements.subheading()
            case keys.PARAGRAPH_ELEMENT:
                return elements.paragraph()
            case keys.IMAGE_ELEMENT:
                return elements.image()
            case keys.VIDEO_ELEMENT:
                return elements.video()
            case keys.LINK_ELEMENT:
                return elements.link()
            default:
                return null
        }
    }
    
    onItemClick(type) {
        const {state, setState} = this.props
        let index = this.props.state.elementMenuOpen
        const {selectedStage} = state
        let newState = {...state}
        let newElements = [...newState.stages[selectedStage].elements]
        const newElement = this.getElement(type)
        newElements.splice(index, 0, newElement);
        
        const pages = elementsToPages(newElements)
        const newPageIndex = findElementPageIndex(pages, newElement)
        
        newState.stages[selectedStage].elements = newElements
        newState.selectedElement = index
        newState.selectedPage = newPageIndex
        newState.elementMenuOpen = index+1
        setState(newState)
    }
    
    renderSubIcon(type) {
        const {classes} = this.props
        return <AddIcon className={classes.mainIcon} fontSize="small" />
    }
    
    renderMainText() {
        const {element, classes} = this.props
        const {text, question} = element
        const mainText = question ? question : text
        if (!mainText) return null
        return (
            <TextareaAutosize
                type="text"
                onChange={e => {
                    this.setProperty(null, question ? 'question' : 'text', e.target.value)
                }}
                className={clsx(classes.inputStyle, classes.mainTextStyle)}
                value={mainText}
            />
        )
    }
    
    renderItem(title, type) {
        const {classes} = this.props
        return (
            <div 
                key={title + type}
                onClick={() => this.onItemClick(type)}
                className={classes.titleContainer}
            >
                <div className={classes.titleWrapper}>
                    {this.renderMainIcon(type)}
                    <p className={classes.elementText}>
                        {title}
                    </p>
                </div>
                {this.renderSubIcon(type)}
            </div>
        )
    }
    
    renderDesignElements() {
        return (
            <React.Fragment>
                {/* <SectionHeader title={strings.premadeElementsLabel}/>
                {this.renderItem(strings.chooseFromTemplatesLabel, "template")} */}
                <SectionHeader title={strings.designElementsLabel}/>
                {designElements.map(el => {
                    return this.renderItem(el.name, el.type)
                })}
                <SectionHeader title={strings.shareElementsLabel}/>
                {shareElements.map(el => {
                    return this.renderItem(el.name, el.type)
                })}
                <SectionHeader title={strings.campaignElementsLabel}/>
                {campaignElements.map(el => {
                    return this.renderItem(el.name, el.type)
                })}
            </React.Fragment>
        )
    }

    render() {
        const { classes } = this.props;
        return(
            <Modal 
                style={{zIndex: 9999}}
                open={this.props.isOpen}
                onClose={() => {                    
                    this.props.close()
                }}
            >
                <div className={classes.modalStyle}>
                    <div className={classes.modalWrapper}>
                        {this.renderDesignElements()}
                    </div>      
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    modalStyle: {
        position: 'absolute',
        top: `50%`,
        height: '80%',
        right: '0px',
        transform: `translate(0, -50%)`,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: 8,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
            width: 300,
            right: `70px`,
            height: '80%',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            borderRadius: 8,
            outline: 'none',
		},
    },
    modalWrapper: {
        borderRadius: 8,
        width: '100%',
        height: '100%',
        overflowY: 'auto'
    },
    titleContainer: {
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 5,
        cursor: 'pointer',
        borderBottom: `solid 1px ${keys.APP_COLOR_GRAY}`,
        '&:hover': {
            transition: '0.1s',
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT
        }
    },
    sideIconContainer: {
        marginRight: 15  
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: "0px 15px"
    },
    
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    mainIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '0px 15px'
    },
    sideIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        marginLeft: 10
    },
    addIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        position: 'absolute',
        right: 15,
        bottom: -15,
        zIndex: 2
    },
    elementText: {
        margin: '0px 0px',
        fontSize: 15
    },
});


export default withStyles(useStyles)(AddElementModal);