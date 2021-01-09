import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { GoogleLogin } from 'react-google-login';
const emailValidator = require("email-validator");
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
import {setProperty, findElementPageIndex, elementsToPages} from './element-editor/sub/functions'
import elements from './element-objects'

const designElements = [
    {
        type: keys.PARAGRAPH_ELEMENT,
        name: 'Paragraph'
    }, {
        type: keys.HEADING_ELEMENT,
        name: 'Heading'
    }, {
        type: keys.SUBHEADING_ELEMENT,
        name: 'Subheading'
    }, {
        type: keys.IMAGE_ELEMENT,
        name: 'Image'
    }, {
        type: keys.VIDEO_ELEMENT,
        name: 'Video'
    }, {
        type: keys.LINK_ELEMENT,
        name: 'Link'
    }, {
        type: keys.SPACING_ELEMENT,
        name: 'Spacing'
    }
]

const shareElements = [
    {
        type: keys.REFERRAL_ELEMENT,
        name: 'Referral'
    }, {
        type: keys.SHARE_ELEMENT,
        name: 'Share'
    }
]

const surveyElements = [
    {
        type: keys.MULTIPLE_CHOICE_ELEMENT,
        name: 'Multiple Choice'
    }, {
        type: keys.CHECKBOX_ELEMENT,
        name: 'Checkbox'
    }, {
        type: keys.FORM_ELEMENT,
        name: 'Form'
    }, {
        type: keys.LONG_FORM_ELEMENT,
        name: 'Long Form'
    }, {
        type: keys.EMAIL_ELEMENT,
        name: 'Email'
    }, {
        type: keys.PHONE_ELEMENT,
        name: 'Phone'
    }, {
        type: keys.NAME_ELEMENT,
        name: 'Name'
    }, {
        type: keys.ADDRESS_ELEMENT,
        name: 'Address'
    }, {
        type: keys.SLIDER_ELEMENT,
        name: 'Slider'
    }, {
        type: keys.DROPDOWN_ELEMENT,
        name: 'Dropdown'
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
                <SectionHeader title="Premade elements"/>
                {this.renderItem("Choose from templates", "template")}
                <SectionHeader title="Design Elements"/>
                {designElements.map(el => {
                    return this.renderItem(el.name, el.type)
                })}
                {/* <SectionHeader title="Share Elements"/>
                {shareElements.map(el => {
                    return this.renderItem(el.name, el.type)
                })} */}
                <SectionHeader title="Survey Elements"/>
                {surveyElements.map(el => {
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