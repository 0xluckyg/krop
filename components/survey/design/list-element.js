import React from 'react';
import clsx from 'clsx';
import TextareaAutosize from 'react-autosize-textarea';

import { withStyles } from '@material-ui/core/styles';
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
    mdiYoutube,
    mdiArrowExpandVertical,
    mdiTrashCanOutline,
    mdiCircleEditOutline,
    
    mdiPlusCircle
} from '@mdi/js';

import {dropdown} from './element-objects'
import {setProperty, findElementPageIndex, elementsToPages} from './element-editor/sub/functions'
import keys from '../../../config/keys'

class ListElement extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    setProperty(propertyType, property, value) {
        const {state, index} = this.props
        setProperty({
            props: this.props,
            selectedStage: state.selectedStage,
            selectedElement: index,
            propertyType,
            property,
            value
        })
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
                text: o,
                media: null
            })
        })
        this.setProperty(null, 'options', newOptions)
    }
    
    getPageIndex(el, i) {
        const {state, index} = this.props
        let elements = el ? el : state.stages[state.selectedStage].elements
        let pages = elementsToPages(elements)
        return findElementPageIndex(pages, elements[index])
    }
    
    removeElement() {
        const {state, setState, index} = this.props
        const {selectedStage} = state
        let newState = {...state}
        
        let newElements = [...newState.stages[selectedStage].elements]
        newElements.splice(index, 1)
        newState.stages[selectedStage].elements = newElements
        newState.selectedElement = null
        newState.selectedPage = 0
        setState(newState)
    }
    
    editElement() {
        const {setState, index} = this.props
        setState({selectedElement: index, selectedPage: this.getPageIndex()})
    }
    
    addElement() {
        const {setState, index} = this.props
        setState({elementMenuOpen: index+1})
    }
    
    renderIcon(icon, style, onClick) { 
        return (
            <Icon path={icon}
                className={style}
                size={0.9}
                color={keys.APP_COLOR_GRAY_DARKEST}
            />
        )
    }
    
    renderMainIcon() {
        const {classes, element} = this.props
        switch(element.type) {
            case keys.SPACING_ELEMENT:
                return this.renderIcon(mdiArrowExpandVertical, classes.mainIcon)
            case keys.MULTIPLE_CHOICE_ELEMENT:
                return this.renderIcon(mdiCheckboxMarkedCircleOutline, classes.mainIcon)
            case keys.CHECKBOX_ELEMENT:
                return this.renderIcon(mdiCheckboxMarkedOutline, classes.mainIcon)
            case keys.DROPDOWN_ELEMENT:
                return this.renderIcon(mdiFormDropdown, classes.mainIcon)
            case keys.SLIDER_ELEMENT:
                return this.renderIcon(mdiRayVertex, classes.mainIcon)
            case keys.FORM_ELEMENT:
                return this.renderIcon(mdiFormTextbox, classes.mainIcon)
            case keys.EMAIL_ELEMENT:
                return this.renderIcon(mdiFormTextbox, classes.mainIcon)
            case keys.PHONE_ELEMENT:
                return this.renderIcon(mdiFormTextbox, classes.mainIcon)
            case keys.ADDRESS_ELEMENT:
                return this.renderIcon(mdiFormTextbox, classes.mainIcon)
            case keys.NAME_ELEMENT:
                return this.renderIcon(mdiFormTextbox, classes.mainIcon)
            case keys.LONG_FORM_ELEMENT:
                return this.renderIcon(mdiFormTextarea, classes.mainIcon)
            case keys.HEADING_ELEMENT:
                return this.renderIcon(mdiFormatHeader1, classes.mainIcon)
            case keys.SUBHEADING_ELEMENT:
                return this.renderIcon(mdiFormatHeader2, classes.mainIcon)
            case keys.PARAGRAPH_ELEMENT:
                return this.renderIcon(mdiFormatParagraph, classes.mainIcon)
            case keys.IMAGE_ELEMENT:
                return this.renderIcon(mdiImageOutline, classes.mainIcon)
            case keys.VIDEO_ELEMENT:
                return this.renderIcon(mdiYoutube, classes.mainIcon)
            case keys.LINK_ELEMENT:
                return this.renderIcon(mdiLink, classes.mainIcon)
            default:
                return null
        }
    }
    
    renderSubIcon(type) {
        const {classes} = this.props
        if (type == 'add') {
            return <AddIcon className={classes.mainIcon} fontSize="small" />
        } else {
            return <div className={classes.sideIconContainer}>
                <IconButton  
                    className={classes.sideIcon} 
                    onClick={(e) => {
                        this.removeElement()
                    }}
                    size="small" variant="contained">
                    {this.renderIcon(mdiTrashCanOutline)}
                </IconButton>
                <IconButton  
                    className={classes.sideIcon} 
                    onClick={(e) => {
                        this.editElement()
                    }}
                    size="small" variant="contained">
                    {this.renderIcon(mdiCircleEditOutline)}
                </IconButton>
            </div>
        }
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
    
    renderOptionsText() {
        const {element, classes} = this.props
        const {options} = element
        if (!options) return null
        return (
            <TextareaAutosize
                type="text"
                onChange={e => {
                    this.handleOptionsChange(e.target.value)  
                }}
                className={clsx(classes.inputStyle, classes.optionsTextStyle)}
                value={this.getOptionsInText(options)}
            />
        )
    }

    render() {
        const {classes, element, type} = this.props

        return (
            <div className={classes.mainContainer}>
                <div className={classes.titleContainer}>
                    <div className={classes.titleWrapper}>
                        {this.renderMainIcon()}
                        <p className={classes.elementText}>{
                            (element.name && element.name != '') ? element.name : element.type
                        }</p>
                    </div>
                    {this.renderSubIcon(type)}
                </div>
                <div className={classes.contentContainer}>
                    {this.renderMainText()}
                    {this.renderOptionsText()}
                </div>
                <IconButton  
                    className={classes.addIcon} 
                    onClick={() => {
                        this.addElement()
                    }}
                    size="small" variant="contained">
                    {this.renderIcon(mdiPlusCircle)}
                </IconButton>
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
        marginBottom: 10,
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text'
    },
    optionsTextStyle: {
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text'
    }
});

export default withStyles(useStyles)(ListElement)