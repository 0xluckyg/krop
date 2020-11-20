import React from 'react';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import SectionIcon from '@material-ui/icons/SelectAll';
import RightIcon from '@material-ui/icons/ChevronRight';
import ImageIcon from '@material-ui/icons/Image';
import FormIcon from '@material-ui/icons/ContactMail';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
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
} from '@mdi/js';


import keys from '../../../config/keys'

class ListElement extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    getOptionsInText(options) {
        let optionsArray = []
        options.map(o => {
            optionsArray.push(o.text) 
        })
        return optionsArray.join('\n')
    }
    
    handleOptionsChange(value) {
        let newOptions = []
        value.split('\n').map((o, i) => {
            newOptions.push({
                option: o,
                actionType: null
            })
        })
        // this.modifyProperty(null, 'options', newOptions)
    }
    
    renderButton(icon, style, onClick) { 
        return (
            <IconButton  
                className={style} 
                onClick={(e) => onClick ? onClick() : null}
                size="small" variant="contained">
                <Icon path={icon}
                    size={0.9}
                    color={keys.APP_COLOR_GRAY_DARKEST}
                />
            </IconButton>
        )
    }
    
    renderIcon() {
        const {classes, elementType} = this.props
        switch(elementType) {
            case keys.MULTIPLE_CHOICE_ELEMENT:
                return this.renderButton(mdiCheckboxMarkedCircleOutline, classes.icon)
            case keys.CHECKBOX_ELEMENT:
                return this.renderButton(mdiCheckboxMarkedOutline, classes.icon)
            case keys.DROPDOWN_ELEMENT:
                return this.renderButton(mdiFormDropdown, classes.icon)
            case keys.SLIDER_ELEMENT:
                return this.renderButton(mdiRayVertex, classes.icon)
            case keys.FORM_ELEMENT:
                return this.renderButton(mdiFormTextbox, classes.icon)
            case keys.EMAIL_ELEMENT:
                return this.renderButton(mdiFormTextbox, classes.icon)
            case keys.PHONE_ELEMENT:
                return this.renderButton(mdiFormTextbox, classes.icon)
            case keys.ADDRESS_ELEMENT:
                return this.renderButton(mdiFormTextbox, classes.icon)
            case keys.NAME_ELEMENT:
                return this.renderButton(mdiFormTextbox, classes.icon)
            case keys.LONG_FORM_ELEMENT:
                return this.renderButton(mdiFormTextarea, classes.icon)
            case keys.HEADING_ELEMENT:
                return this.renderButton(mdiFormatHeader1, classes.icon)
            case keys.SUBHEADING_ELEMENT:
                return this.renderButton(mdiFormatHeader2, classes.icon)
            case keys.PARAGRAPH_ELEMENT:
                return this.renderButton(mdiFormatParagraph, classes.icon)
            case keys.MEDIA_ELEMENT:
                return this.renderButton(mdiImageOutline, classes.icon)
            case keys.LINK_ELEMENT:
                return this.renderButton(mdiLink, classes.icon)
            default:
                return null
        }
    }
    
    renderSubIcon(type) {
        const {classes} = this.props
        if (type == 'add') {
            return <AddIcon className={classes.icon} fontSize="small" />
        } else {
            return <RightIcon className={classes.icon} fontSize="small" />   
        }
    }
    
    renderMainText() {
        const {element, classes} = this.props
        const {text, question} = element
        const mainText = question ? question : text
        if (!mainText) return null
        return (
            <textarea value={mainText} className={clsx(classes.inputStyle, classes.mainTextStyle)} type="text"></textarea>
        )
    }
    
    renderOptionsText() {
        const {element, classes} = this.props
        const {options} = element
        if (!options) return null
        return (
            <textarea  value={this.getOptionsInText(options)} className={clsx(classes.inputStyle, classes.optionsTextStyle)} type="text"></textarea>
        )
    }

    render() {
        const {classes, elementName, elementType, type, onClick} = this.props

        return (
            <div className={classes.mainContainer}>
                <div className={classes.titleContainer}>
                    <div className={classes.titleWrapper}>
                        {this.renderIcon()}
                        <p className={classes.elementText}>{
                            (elementName && elementName != '') ? elementName : elementType
                        }</p>
                    </div>
                    {this.renderSubIcon(type)}
                </div>
                <div className={classes.contentContainer}>
                    {this.renderMainText()}
                    {this.renderOptionsText()}
                </div>
                <AddIcon className={classes.addIcon} fontSize="small"/>
            </div>
        );
    }
}

const useStyles = theme => ({
    mainContainer: {
        position: 'relative',
        cursor: 'pointer',
        borderTop: `0.15px solid ${keys.APP_COLOR_GRAY}`,
        width: '100%',
        backgroundColor: 'transparent',
        padding: '20px 0px',
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT
        },
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
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
    icon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '0px 15px'
    },
    addIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        position: 'absolute',
        right: 15,
        bottom: -10,
        zIndex: 100
    },
    elementText: {
        margin: '0px 0px',
        fontSize: 15
    },
    inputStyle: {
        border: 'none',
        background: 'transparent',
        fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        resize: 'none',
        fontSize: 15,
        '&:focus': {
            outline: 'none'
        }
    },
    mainTextStyle: {
        height: 28
    },
    optionsTextStyle: {
        
    }
});

export default withStyles(useStyles)(ListElement)