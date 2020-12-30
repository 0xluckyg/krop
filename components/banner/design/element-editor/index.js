import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@mdi/react'
import { 
    mdiLockOutline
} from '@mdi/js';

import keys from '../../../../config/keys'
import QrEditor from './qr'
import TextEditor from './text'
import ImageEditor from './image'
import BoxEditor from './box'
import MainboardEditor from './mainboard'
import VideoEditor from './video'
import {modifyProperty, getProperty, getElement, modifyElement} from './sub/functions'

class ElementEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {selectedElement, selectedStage} = this.props.state
        if (selectedElement == null) return
        return getElement({
            props: this.props, selectedStage, selectedElement
        })
    }
    
    modifyProperty(propertyType, property, value) {
        let {selectedElement, selectedStage} = this.props.state
        modifyProperty({
            props: this.props, selectedStage, selectedElement, propertyType, property, value  
        })
    }
    
    isMobileOptimizedMode(element) {
        let {viewMode} = this.props.state
        element = element ? element : this.getElement()
        if (viewMode != keys.PHONE_ELEMENT || !element || !element.mobile) return false
        return element.mobile.enabled
    }
    
    getMainboardDimension() {
        let {state} = this.props
        const {selectedStage, backgroundWidth, backgroundHeight} = state
        let mainboard = getElement({
            props: this.props, selectedStage, selectedElement: keys.MAINBOARD_ELEMENT
        })
        let mainboardPosition = mainboard.position

        const parentWidth = (mainboardPosition.widthType == 'percent') ? backgroundWidth * mainboardPosition.width / 100 : mainboardPosition.width
        const parentHeight = (mainboardPosition.heightType == 'percent') ? backgroundHeight * mainboardPosition.height / 100 : mainboardPosition.height
        return {parentWidth, parentHeight}
    }
    
    getBackgroundDimension() {
        let {state} = this.props
        const {backgroundWidth, backgroundHeight} = state
        return { parentWidth: backgroundWidth, parentHeight: backgroundHeight }
    }
    
    removeElement() {
        let newState = {...this.props.state}
        let elementIndex = this.props.state.selectedElement
        if (elementIndex == null) return
        
        let newElements = [...newState.elements]
        newElements.splice(elementIndex, 1)
        newState.elements = newElements
        newState.selectedElement = null
        this.props.setState(newState)
    }
    
    lockElement() {
        let element = this.getElement()
        if (!element) return
        this.modifyProperty(null, 'locked', !element.locked)
    }
    
    renderDeleteButton() {
        const {classes} = this.props
        let {selectedElement} = this.props.state
        if (selectedElement == keys.MAINBOARD_ELEMENT || 
        selectedElement == keys.TAB || 
        selectedElement == keys.ALERT ||
        selectedElement == keys.BACKGROUND) {
            return null
        }
        return (
            <Fragment>
                <IconButton  className={classes.deleteButtonWrapper}  onClick={() => this.removeElement()} 
                size="small" variant="contained" color="primary">
                    <DeleteIcon className={classes.buttonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
    }
    
    renderLockButton() {
        const {classes} = this.props
        const element = this.getElement()
        if (!element) return
        const color = element.locked ? keys.APP_COLOR : keys.APP_COLOR_GRAY_DARKEST
        return (
            <Fragment>
                <IconButton  className={classes.deleteButtonWrapper}  onClick={() => this.lockElement()} 
                size="small" variant="contained" color="primary">
                    <Icon path={mdiLockOutline}
                        size={0.8}
                        color={color}
                    />
                </IconButton >
            </Fragment>
        )
    }
    
    renderExitButton() {
        const {classes, onExit} = this.props
        return (
            <Fragment>
                <IconButton  className={classes.buttonIconWrapper}  onClick={onExit} 
                size="small" variant="contained" color="primary">
                    <CloseIcon className={classes.buttonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
    }
    
    renderMainHeader(text) {
        const {classes} = this.props
        
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>{text}</p>
                <div>
                {this.renderDeleteButton()}
                {this.renderLockButton()}
                {this.renderExitButton()}
                </div>
            </div>    
        )
    }
    
    renderSubHeader(text) {
        const {classes} = this.props
        return (
            <div className={classes.subHeader}>
                <p className={classes.subHeaderText}>{text} Element</p>
            </div>    
        )
    }
    
    renderEditorContent() {
        const {state, setState} = this.props
        const {selectedElement} = state
        const elm = this.getElement()
        const type = elm ? elm.type : null

        switch(type) {
            case(keys.QR_ELEMENT):
                return <QrEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getMainboardDimension()}
                />
            case(keys.TEXT_ELEMENT):
                return <TextEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getMainboardDimension()}
                />
            case(keys.IMAGE_ELEMENT):
                return <ImageEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getMainboardDimension()}
                />
            case(keys.BOX_ELEMENT):
                return <BoxEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getMainboardDimension()}
                />
            case(keys.VIDEO_ELEMENT):
                return <VideoEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getMainboardDimension()}
                />
            case(keys.MAINBOARD_ELEMENT):
                return <MainboardEditor
                    element={selectedElement}
                    state={state}
                    setState={setState}
                    getParentDimension={() => this.getBackgroundDimension()}
                />
            default:
                return null
        }
    }
    
    render() {
        const {classes} = this.props
        const elm = this.getElement()
        let type = elm ? elm.type : null
        let name = elm ? elm.name : null
        let headerName = name ? name : type
        return (
            <div className={classes.sideEditor}>
                {this.renderMainHeader(headerName)}
                <div className={classes.elementEditor}>
                    {this.renderEditorContent()}
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({    
    sideEditor: {
        position: 'absolute',
        top: 0,
        zIndex: 5,
        width: 350,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        boxShadow: '-1px 0px 3px -1px rgba(21,27,38,.15)'
    },
    elementsHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR_GRAY,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    elementsHeaderText: {
        fontSize: 15,
        color: keys.APP_COLOR_GRAY_DARKEST,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    deleteButtonWrapper: {
        marginRight: 10
    },
    buttonIconWrapper: {
        marginRight: 20
    },
    buttonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    subHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        display: 'flex',
        alignItems: 'center'
    },
    subHeaderText: {
        fontSize: 12,
        marginLeft: 20
    },
    elementEditor: {
        width: '100%',
        flex: 1,
        overflowY: 'auto'
    }
})

export default withStyles(useStyles)(ElementEditor)