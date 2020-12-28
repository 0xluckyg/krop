import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { 
    mdiFormatHorizontalAlignLeft , 
    mdiFormatHorizontalAlignRight ,  
    mdiFormatVerticalAlignBottom ,
    mdiFormatVerticalAlignTop ,
    mdiPercentOutline,
    mdiLockOutline,
    mdiLockOpenOutline,
    mdiAxisXRotateClockwise,
    mdiAxisZRotateClockwise,
    mdiToggleSwitch,
    mdiToggleSwitchOffOutline
} from '@mdi/js';

import keys from '../../../../../config/keys'
import SectionContainer from '../frame/section-container'
import SubHeader from '../frame/sub-header'
import SliderField from './slider-field'
import {
    handleDisabled, 
    handleLimit, 
    modifyProperty, 
    getProperty, 
    getElement,
    modifyElement
}  from './functions'
import {
    positionToPercent,
    positionToPx,
    convertAnchorPx,
    dimensionToPercent,
    dimensionToPx,
    getAspectRatioDimensions
} from '../../preview/sub/functions'

class Position extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            selectedRotate: 0
        }
    }
    
    getProperty(propertyType, property) {
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, property, 
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        value = typeof value == 'string' ? Number(value) : value
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
            props: this.props, 
            selectedElement: element
        })
    }

    modifyElement(newElement) {
        const {element} = this.props
        modifyElement({
            props: this.props, 
            selectedElement: element, 
            element: newElement
        })
    }
    
    getMax() {
        
        const parent = this.props.getParentDimension()
        const element = this.getElement()
        
        let maxW = this.props.maxWidth ? this.props.maxWidth : parent.parentWidth
        let maxH = this.props.maxHeight ? this.props.maxHeight : parent.parentHeight
        let maxX = this.props.maxX ? this.props.maxX : parent.parentWidth
        let maxY = this.props.maxY ? this.props.maxY : parent.parentHeight

        const {xAnchor, yAnchor, widthType, heightType} = element.position
        
        maxX = (xAnchor == 'percent') ? 100 : maxX
        maxY = (yAnchor == 'percent') ? 100 : maxY
        maxW = (widthType == 'percent') ? 100 : maxW
        maxH = (heightType == 'percent') ? 100 : maxH
        
        return {maxX,maxY,maxW,maxH}
    }
    
    handleScaleChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        this.modifyProperty('position', 'scale', value)
    }
    
    handleXChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        this.modifyProperty('position', 'x', value)
    }
    
    handleYChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        this.modifyProperty('position', 'y', value)
    }
    
    handleWidthChange(value, min, max) {
        let element = this.getElement()
        const parent = this.props.getParentDimension()
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        let {aspectRatio, widthType, heightType} = element.position
        if (element.position.aspectRatio) {
            let aspectDimensions = getAspectRatioDimensions(aspectRatio, value, null, widthType, heightType, parent)
            element.position.width = aspectDimensions.width
            element.position.height = aspectDimensions.height
            this.modifyElement(element)
        } else {
            this.modifyProperty('position', 'width', value)
        }   
    }
    
    handleHeightChange(value, min, max) {
        let element = this.getElement()
        const parent = this.props.getParentDimension()
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        const {aspectRatio, widthType, heightType} = element.position
        if (element.position.aspectRatio) {
            let aspectDimensions = getAspectRatioDimensions(aspectRatio, null, value, widthType, heightType, parent)
            element.position.width = aspectDimensions.width
            element.position.height = aspectDimensions.height
            this.modifyElement(element)
        } else {
            this.modifyProperty('position', 'height', value)
        }   
    }
    
    handleXAnchorChange(value) {
        
        let element = this.getElement()
        let {xAnchor, x, width, widthType} = element.position
        const parent = this.props.getParentDimension()
        if (widthType == 'percent') {
            width = parent.parentWidth * width / 100
        }

        if ((xAnchor == 'left' && value == 'right') || 
            (xAnchor == 'right' && value == 'left')) {
            x = convertAnchorPx(parent.parentWidth, width, x)
        }
        if (xAnchor == 'percent' && value == 'left') {
            x = positionToPx(parent.parentWidth, width, x)
        }
        if (xAnchor == 'percent' && value == 'right') {
            x = positionToPx(parent.parentWidth, width, x)
            x = convertAnchorPx(parent.parentWidth, width, x)
        }
        if (xAnchor == 'left' && value == 'percent') {
            x = positionToPercent(parent.parentWidth, width, x)
        }
        if (xAnchor == 'right' && value == 'percent') {
            x = convertAnchorPx(parent.parentWidth, width, x)
            x = positionToPercent(parent.parentWidth, width, x)
        }
        element.position.x = Math.round(x * 100) / 100
        element.position.xAnchor = value
        this.modifyElement(element)
    }
    
    handleYAnchorChange(value) {
        
        let element = this.getElement()
        let {yAnchor, y, height, heightType} = element.position
        const parent = this.props.getParentDimension()
        if (heightType == 'percent') {
            height = parent.parentHeight * height / 100
        }
        
        if ((yAnchor == 'top' && value == 'bottom') || 
            (yAnchor == 'bottom' && value == 'top')) {
            y = convertAnchorPx(parent.parentHeight, height, y)
        }
        if (yAnchor == 'percent' && value == 'top') {
            y = positionToPx(parent.parentHeight, height, y)
        }
        if (yAnchor == 'percent' && value == 'bottom') {
            y = positionToPx(parent.parentHeight, height, y)
            y = convertAnchorPx(parent.parentHeight, height, y)
        }
        if (yAnchor == 'top' && value == 'percent') {
            y = positionToPercent(parent.parentHeight, height, y)
        }
        if (yAnchor == 'bottom' && value == 'percent') {
            y = convertAnchorPx(parent.parentHeight, height, y)
            y = positionToPercent(parent.parentHeight, height, y)
        }
        element.position.y = Math.round(y * 100) / 100
        element.position.yAnchor = value
        this.modifyElement(element)
    }
    
    handleDimensionTypeChange(property) {
        
        let element = this.getElement()
        const parent = this.props.getParentDimension()
        let parentDimensionType = (property == 'widthType') ? 'parentWidth' : 'parentHeight'
        let dimensionType = (property == 'widthType') ? 'width' : 'height'
        const value = element.position[property]
        const newValue = (value == 'px') ? 'percent' : 'px'
        let dimension;
        if (newValue == 'px') {
            dimension = dimensionToPx(parent[parentDimensionType], element.position[dimensionType])
        } else {
            dimension = dimensionToPercent(parent[parentDimensionType], element.position[dimensionType])
        }
        
        element.position[dimensionType] = dimension
        element.position[property] = newValue
        this.modifyElement(element)
    }
    
    handleAspectRatioChange() {
        
        let element = this.getElement()
        let {aspectRatio, widthType, heightType, width, height} = element.position
        if (!aspectRatio) {
            let parent = this.props.getParentDimension()
            if (widthType == 'percent') width = dimensionToPx(parent.parentWidth, width)
            if (heightType == 'percent') height = dimensionToPx(parent.parentHeight, height)
            aspectRatio = Math.round(width / height * 1000) / 1000
        } else {
            aspectRatio = false
        }
        this.modifyProperty('position', 'aspectRatio', aspectRatio)
    }
    
    handleRotateChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        
        
        const {selectedRotate} = this.state
        let rotate = this.getProperty('position', 'rotate')
        let newRotation = [...rotate]
        newRotation[selectedRotate] = value
        this.modifyProperty('position', 'rotate', newRotation)
    }
    
    getXLabel(element) {
        let mobileLabel = this.isMobileOptimizedMode() == keys.PHONE_ELEMENT ? 'Mobile ' : ''
        
        const {xAnchor} = element['position']
        
        switch(xAnchor) {
            case('left'):
                return mobileLabel + 'X (Px from left)'
            case('percent'):
                return mobileLabel + 'X (Percent)'
            case('right'):
                return mobileLabel + 'X (Px from right)'
            default:
                return mobileLabel + 'X'
        }
    }
    
    getYLabel(element) {
        let mobileLabel = this.isMobileOptimizedMode() == keys.PHONE_ELEMENT ? 'Mobile ' : ''

        const {yAnchor} = element.position
        
        switch(yAnchor) {
            case('top'):
                return mobileLabel + 'Y (Px from top)'
            case('percent'):
                return mobileLabel + 'Y (Percent)'
            case('bottom'):
                return mobileLabel + 'Y (Px from bottom)'
            default:
                return mobileLabel + 'Y'
        }
    }
    
    getWidthLabel(element) {
        let mobileLabel = this.isMobileOptimizedMode() == keys.PHONE_ELEMENT ? 'Mobile ' : ''
        
        const {widthType} = element.position
        return (widthType == 'px') ? mobileLabel + 'Width (Px)' : mobileLabel + 'Width (Percent)'
    }
    
    getHeightLabel(element) {
        let mobileLabel = this.isMobileOptimizedMode() == keys.PHONE_ELEMENT ? 'Mobile ' : ''
        
        const {heightType} = element.position
        return (heightType == 'px') ? mobileLabel + 'Height (Px)' : mobileLabel + 'Height (Percent)'
    }
    
    getRotateLabel() {
        let mobileLabel = this.isMobileOptimizedMode() == keys.PHONE_ELEMENT ? 'Mobile ' : ''
        return mobileLabel + 'Rotation'
    }
    
    switchMobileMode() {
        const element = this.getElement()
        if (element.mobile && element.mobile.enabled) {
            element.mobile.enabled = false
        } else {
            element.mobile = {enabled: true, ...element.position}      
        }
        this.modifyElement(element)
    }
    
    isMobileOptimizedMode() {
        let {viewMode} = this.props.state
        const element = this.getElement()
        if (viewMode != keys.PHONE_ELEMENT || !element || !element.mobile) return false
        return element.mobile.enabled
    }

    renderMobileSwitch() {
        const {classes} = this.props
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        const enabled = this.isMobileOptimizedMode()
        
        return (
            <IconButton  
                className={classes.iconButton} 
                onClick={() => this.switchMobileMode()}
                size="small" variant="contained" color="primary">
                <Icon path={enabled ? mdiToggleSwitch : mdiToggleSwitchOffOutline}
                    size={0.9}
                    color={enabled ? selectedColor : notSelectedColor}
                />
            </IconButton >
        )
    }
    
    renderXAnchorPicker() {
        let {classes} = this.props
        
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        const xAnchorValue = this.getProperty('position', 'xAnchor')
        const leftIcon = mdiFormatHorizontalAlignLeft
        const rightIcon = mdiFormatHorizontalAlignRight
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleXAnchorChange('left')}
                    size="small" variant="contained" color="primary">
                    <Icon path={leftIcon}
                        size={0.7}
                        color={xAnchorValue == 'left' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleXAnchorChange('percent')}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPercentOutline}
                        size={0.7}
                        color={xAnchorValue == 'percent' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleXAnchorChange('right')}
                    size="small" variant="contained" color="primary">
                    <Icon path={rightIcon}
                        size={0.7}
                        color={xAnchorValue == 'right' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
    
    renderYAnchorPicker() {
        let {classes} = this.props
        
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        const yAnchorValue = this.getProperty('position', 'yAnchor')
        const topIcon = mdiFormatVerticalAlignTop
        const bottomIcon = mdiFormatVerticalAlignBottom
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleYAnchorChange('top')}
                    size="small" variant="contained" color="primary">
                    <Icon path={topIcon}
                        size={0.7}
                        color={yAnchorValue == 'top' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleYAnchorChange('percent')}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPercentOutline}
                        size={0.7}
                        color={yAnchorValue == 'percent' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleYAnchorChange('bottom')}
                    size="small" variant="contained" color="primary">
                    <Icon path={bottomIcon}
                        size={0.7}
                        color={yAnchorValue == 'bottom' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
    renderSizeTypePicker(property) {
        let {classes} = this.props
        
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        
        if (property != 'width' && property != 'height') return
        let percentProperty = (property == 'width') ? 'widthType' : 'heightType'
        const isPercent = this.getProperty('position', percentProperty)
        
        const isAspectRatio = this.getProperty('position', 'aspectRatio')
        const aspectRatioIcon = (isAspectRatio) ? mdiLockOutline : mdiLockOpenOutline
        
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleDimensionTypeChange(percentProperty)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPercentOutline}
                        size={0.7}
                        color={isPercent == 'percent' ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.handleAspectRatioChange()}
                    size="small" variant="contained" color="primary">
                    <Icon path={aspectRatioIcon}
                        size={0.7}
                        color={isAspectRatio ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
    
    renderRotatePicker(onClick, selected) {
        const {classes} = this.props
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(0)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiAxisXRotateClockwise}
                        size={0.9}
                        color={selected == 0 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(1)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiAxisZRotateClockwise}
                        size={0.9}
                        color={selected == 1 ? selectedColor : notSelectedColor}
                        rotate={90}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(2)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiAxisZRotateClockwise}
                        size={0.9}
                        color={selected == 2 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
    
    renderSliderField(type, property, label, min, max, onChange, step, defaultValue) {
        if (handleDisabled(this.props, property)) return 
        let value = this.getProperty(type, property)
        value = value ? value : defaultValue ? defaultValue : 1
        let typeSelector;
        
        switch(property) {
            case('x'):
                typeSelector = this.renderXAnchorPicker()
                break;
            case('y'):
                typeSelector = this.renderYAnchorPicker()
                break;
            case('width'):
                typeSelector = this.renderSizeTypePicker('width')
                break;
            case('height'):
                typeSelector = this.renderSizeTypePicker('height')
                break;
            case('rotate'):
                min = -360; max = 360
                value = value[this.state.selectedRotate]
                typeSelector = this.renderRotatePicker((n) => this.setState({selectedRotate: n}), this.state.selectedRotate)
                break;
            default:
                break;
        }

        return (
            <SliderField
                textChange={event => {
                    if (property == 'x' || property == 'y') min = undefined
                    onChange(event.target.value, min)
                }}
                sliderChange={(event, value) => onChange(value, min, max)}
                value={value}
                label={label}
                min={min}
                max={max}
                icons={typeSelector}
                step={step}
            />
        )
    }
    
    renderScale(type) {
        return this.renderSliderField(type, 'scale', 'Scale', 0, 1, this.handleScaleChange.bind(this), 0.01, 1)   
    }
    
    render() {
        let {device} = this.props
        
        const {maxX,maxY,maxW,maxH} = this.getMax()
        const element = this.getElement()
        return (
            
            <SectionContainer title="Position">
                {device == keys.PHONE_ELEMENT ? 
                    <SubHeader 
                        title="Optimize for Mobile Positions"
                        Button={() => this.renderMobileSwitch()}
                    /> : null
                }
                {this.renderScale('position')}
                {this.renderSliderField('position', 'x', this.getXLabel(element), 0, maxX, 
                    this.handleXChange.bind(this))
                }
                {this.renderSliderField('position', 'y', this.getYLabel(element), 0, maxY, 
                    this.handleYChange.bind(this))
                }
                {this.renderSliderField('position', 'width', this.getWidthLabel(element), 0, maxW, 
                    this.handleWidthChange.bind(this))
                }
                {this.renderSliderField('position', 'height', this.getHeightLabel(element), 0, maxH, 
                    this.handleHeightChange.bind(this))
                }
                {this.renderSliderField('position', 'rotate', this.getRotateLabel(), -360, 360, 
                    this.handleRotateChange.bind(this))
                }
            </SectionContainer>
        )
    }
}


const useStyles = theme => ({  
    positionContainer: {
        margin: 30,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        marginBottom: 13
    },
    iconContainer: {
         marginLeft: 3
    },
    iconButton: {
        height: 30,
        width: 30
    },
    alignmentContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
})

export default withStyles(useStyles)(Position)