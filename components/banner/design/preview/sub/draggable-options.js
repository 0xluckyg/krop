import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Icon from '@mdi/react'
import IconButton from '@material-ui/core/IconButton';
import { 
    mdiContentCopy,
    mdiTrashCanOutline,
    mdiLockOutline,
    mdiAspectRatio,
    mdiFormatAlignCenter,
    mdiArrowLeft, 
    mdiArrowRight,  
    mdiArrowDown,
    mdiArrowUp
} from '@mdi/js';
import keys from '../../../../../config/keys'
import {modifyElement, modifyProperty, getElement, getProperty} from '../../element-editor/sub/functions'

class DraggableOptions extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getProperty(propertyType, property) {
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType,
            property
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, 
            property, 
            value
        })
    }
    
    getElement() {
        const {element} = this.props
        return getElement({
            props:this.props, 
            selectedElement:element, 
        })
    }
    
    modifyElement(newElement) {
        const {element} = this.props
        modifyElement({
            props: this.props, 
            selectedElement:element, 
            element:newElement, 
        })
    }
    
    isLocked() {
        return this.getProperty(null, 'locked')
    }
    
    isAspectRatio() {
        const element = this.getElement()
        return this.getProperty('position', 'aspectRatio')
    }
    
    handleDuplicate() {
        let newState = {...this.props.state}
        let elementIndex = this.props.state.selectedElement
        if (elementIndex == null) return
        
        let duplicateElement = {...newState.elements[elementIndex]}
        let newElements = [duplicateElement,...newState.elements]
        newState.elements = newElements
        this.props.setState(newState)
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
    
    handleLockElement() {
        this.modifyProperty(null, 'locked', !this.isLocked())
    }
    
    handleAspectRatio() {
        const element = this.getElement()
        this.modifyProperty('position', 'aspectRatio', !this.isAspectRatio())
    }
    
    handlePositionChange(anchor, anchorValue, position, positionValue) {
        const element = this.getElement()
        let newElement = JSON.parse(JSON.stringify(element))
        newElement.position[anchor] = anchorValue
        newElement.position[position] = positionValue
        this.modifyElement(newElement)
    }
    
    handleMoveUp() {
        this.handlePositionChange('yAnchor', 'top', 'y', 0)
    }
    
    handleMoveRight() {
        this.handlePositionChange('xAnchor', 'right', 'x', 0)
    }
    
    handleMoveDown() {
        this.handlePositionChange('yAnchor', 'bottom', 'y', 0)
    }
    
    handleMoveLeft() {
        this.handlePositionChange('xAnchor', 'left', 'x', 0)
    }
    
    handleCenterVertical() {
        this.handlePositionChange('yAnchor', 'percent', 'y', 50)
    }
    
    handleCenterHorizontal() {
        this.handlePositionChange('xAnchor', 'percent', 'x', 50)
    }
    
    renderButton(type, action) {
        const {classes} = this.props
        let icon
        let size = 0.7
        let rotate = 0
        let color = keys.APP_COLOR_GRAY_DARK
        switch(type) {
            case('copy'):
                icon = mdiContentCopy
                size = 0.6
                break;
            case('delete'):
                icon = mdiTrashCanOutline
                break;
            case('lock'):
                icon = mdiLockOutline
                color = this.isLocked() ? keys.APP_COLOR : keys.APP_COLOR_GRAY_DARK
                break;
            case('aspect'):
                icon = mdiAspectRatio
                color = this.isAspectRatio() ? keys.APP_COLOR : keys.APP_COLOR_GRAY_DARK
                break;
            case('centerHorizontal'):
                icon = mdiFormatAlignCenter
                break;
            case('centerVertical'):
                icon = mdiFormatAlignCenter
                rotate = 90
                break;
            case('left'):
                icon = mdiArrowLeft
                break;
            case('right'):
                icon = mdiArrowRight
                break;
            case('top'):
                icon = mdiArrowUp
                break;
            case('bottom'):
                icon = mdiArrowDown
                break;
        }
        return (
            <IconButton  
                className={classes.iconButton} 
                onClick={(e) => {
                    e.stopPropagation()
                    action()
                }}
                size="small" variant="contained" color="secondary">
                <Icon path={icon}
                    size={size}
                    color={color}
                    rotate={rotate}
                />
            </IconButton >
        )
    }
    
    showController() {
        const {state, element, sectionElement} = this.props
        if (typeof sectionElement !== 'undefined') {
            return false
        } else if (element != state.selectedElement) {
            return false
        } else {
            return true   
        }
    }
    
    render() {
        if (!this.showController()) return null
        const {classes} = this.props
        return (
            <div className={classes.optionsContainer}>
                <div className={classes.optionsWrapper}>
                    {this.renderButton("copy", () => this.handleDuplicate())}
                    {this.renderButton("delete", () => this.removeElement())}
                    {this.renderButton("lock", () => this.handleLockElement())}
                    {this.renderButton("aspect", () => this.handleAspectRatio())}
                    {this.renderButton("centerHorizontal", () => this.handleCenterHorizontal())}
                </div>
                <div className={classes.optionsWrapper}>
                    {this.renderButton("top", () => this.handleMoveUp())}
                    {this.renderButton("right", () => this.handleMoveRight())}
                    {this.renderButton("bottom", () => this.handleMoveDown())}
                    {this.renderButton("left", () => this.handleMoveLeft())}
                    {this.renderButton("centerVertical", () => this.handleCenterVertical())}
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({
    optionsContainer: {
        position: 'absolute',
        // width: 50,
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 5,
        // border: `1px solid ${keys.APP_COLOR_GRAY}`,
        top: 0,
        right: -55,
        display: 'flex',
        flexDirection: 'row'  
    },
    optionsWrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    iconButton: {
        width: 25,
        height: 25,
        color: keys.APP_COLOR_GRAY,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: 21,
        height: 21
    },
})

export default withStyles(useStyles)(DraggableOptions)