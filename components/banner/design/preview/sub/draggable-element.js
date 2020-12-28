import React from 'react'
import {Rnd} from 'react-rnd'

import {modifyProperty, getProperty, getElement}  from '../../element-editor/sub/functions'
import {
    positionToPx, 
    positionToPercent, 
    dimensionToPx,
    dimensionToPercent, 
    convertAnchorPx, 
    getElementRelativeCenter
} from './functions'
import DraggableOptions from './draggable-options'
import keys from '../../../../../config/keys'

class DraggableElement extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isDragging: false,
            isResizing: false,
            temporaryX: 0,
            temporaryY: 0,
            temporaryW: 0,
            temporaryH: 0
        }
    }
    
    componentDidMount() {
        const parent = this.props.getParentDimension()
        let { x, y, width, height } = this.getPosition(parent)
        this.setState({temporaryX:x, temporaryY:y, temporaryW:width, temporaryH:height})
        // this.handleArrowKeyPress(parent)
    }
    
    handleArrowKeyPress(parent) {
        document.addEventListener('keydown', (event) => {
            if (this.props.element != this.props.state.selectedElement) return
            if (!this.props.state.isInteractingWithPreview) return
            if (![37,38,39,40].includes(event.keyCode)) return
            
            if (this.timer) clearTimeout(this.timer)
            this.setState({isDragging: true})
            
            const element = this.getElement()
            let {x, y, width, height, xAnchor, yAnchor}  = element.position
            
            switch(event.keyCode) {
                //left
                case 37:
                    x = (xAnchor == 'right') ? x+1 : x-1
                    this.handlePropertyChange('position', 'x', x)
                    break
                //up
                case 38:
                    y = (yAnchor == 'bottom') ? y+1 : y-1
                    this.handlePropertyChange('position', 'y', y)
                    break
                //right
                case 39:
                    x = (xAnchor == 'right') ? x-1 : x+1
                    this.handlePropertyChange('position', 'x', x)
                    break
                //down
                case 40:
                    y = (yAnchor == 'bottom') ? y-1 : y+1
                    this.handlePropertyChange('position', 'y', y)
                    break
            }
            
            x = (xAnchor == 'percent') ? positionToPx(parent.parentWidth, width, x) : x
            y = (yAnchor == 'percent') ? positionToPx(parent.parentHeight, height, y) : y
            this.setTemporaryCoordinates(x, y)
            this.setElementCenter(
                x, y, width, height, parent
            )
            this.timer = setTimeout(() => {
                this.props.setCenterRuler(false, false)
                this.setState({isDragging: false})
            }, 1000);
            
        })
    }
    
    getElement() {
        const {element, sectionElement} = this.props
        return getElement({
            props: this.props, 
            selectedElement: element, 
            selectedSectionElement: sectionElement
        })
    }
    
    getParentElement() {
        const {element} = this.props
        return getElement({props: this.props, selectedElement: element})
    }
    
    handlePropertyChange(propertyType, property, value) {
        const {state, element, sectionElement} = this.props
        const selectedStage = state.selectedStage
        modifyProperty({
            props: this.props, selectedStage, selectedElement: element, propertyType, property, value, selectedSectionElement: sectionElement
        })
    }
    
    getRndStyle() {
        const {zIndex, state, element, sectionElement} = this.props
        const {selectedElement, selectedSectionElement} = state
        const thisElement = this.getElement()
        
        let outline = null
        if (sectionElement || sectionElement === 0) {
            if (element == selectedElement && sectionElement == selectedSectionElement && typeof sectionElement !== 'undefined') {
                outline = `0.3px dashed ${keys.APP_COLOR}`
            }
        } else {
            if (element == selectedElement) {
                outline = `0.3px dashed ${keys.APP_COLOR}`
            }
            if (element == selectedElement && thisElement.type == keys.SECTION) {
                outline = `0.3px solid ${keys.APP_COLOR}`
            }
        }
        
        return {
            backgroundColor: 'transparent',
            outline,
            zIndex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
    
    getSpecStyle(element) {
        const {isDragging, isResizing} = this.state
        const {xAnchor, yAnchor} = element.position
        const top = (yAnchor == 'top' || yAnchor == 'percent') ? -25 : null
        const bottom = (yAnchor == 'bottom') ? -25 : null
        const left = (xAnchor == 'left' || xAnchor == 'percent') ? 0 : null
        const right = (xAnchor == 'right') ? 0 : null
        
        let style = {
            position: 'absolute',
            backgroundColor: keys.APP_COLOR,
            opacity: 0.7,
            borderRadius: 5,
            padding: '3px 5px',
            color: 'white',
            fontSize: 10,
            top, bottom, left, right,
        }
        if (!isDragging && !isResizing) {
            style.display = 'none'
        }
        return style
    }
    
    handleSelect() {
        const {element, sectionElement} = this.props
        this.props.setState({
            selectedElement: element,
            selectedSectionElement: sectionElement
        })  
    }
    
    setElementCenter(elementX, elementY, elementWidth, elementHeight, parent) {
        const {parentWidth, parentHeight} = parent
        const {x,y} = getElementRelativeCenter(parentWidth, parentHeight, elementWidth, elementHeight)
        const errorOffset = 3
        
        const xCentered = (Math.abs(x - elementX) < errorOffset)
        const yCentered = (Math.abs(y - elementY) < errorOffset)
        
        this.props.setCenterRuler(
            yCentered, xCentered
        )
    }
    
    translateAnchorToPx(x, y, element, parent, isRaw) {
        const {parentWidth, parentHeight} = parent
        const position = element.position
        let {width, height, widthType, heightType, xAnchor, yAnchor} = position
        if (widthType == 'percent') {
            width = parentWidth * width / 100
        }
        if (heightType == 'percent') {
            height = parentHeight * height / 100
        }
        
        switch(xAnchor) {
            case('left'):
                break
            case('percent'):
                x = (isRaw) ? 
                positionToPx(parentWidth, width, x) : 
                positionToPercent(parentWidth, width, x)
                break
            case('right'):
                x = convertAnchorPx(parentWidth, width, x)
                break
        }
        switch(yAnchor) {
            case('top'):
                break
            case('percent'):
                y = (isRaw) ? 
                positionToPx(parentHeight, height, y) : 
                positionToPercent(parentHeight, height, y)
                break
            case('bottom'):
                y = convertAnchorPx(parentHeight, height, y)
                break
        }
        return {x, y}
    }
    
    translateDimensionToPx(width, height, element, parent, isRaw) {
        const {parentWidth, parentHeight} = parent
        const position = element.position
        let {widthType, heightType} = position

        if (widthType == 'percent') {
            width = (isRaw) ? dimensionToPx(parentWidth, width) : dimensionToPercent(parentWidth, width)
        }
        if (heightType == 'percent') {
            height = (isRaw) ? dimensionToPx(parentHeight, height) : dimensionToPercent(parentHeight, height)
        }
        
        return {width: Number(width), height: Number(height)}
    }
    
    getPosition(parent) {
        const element = this.getElement()
        const { x, y, width, height, aspectRatio } = element.position
        const p = this.translateAnchorToPx(x, y, element, parent, true)
        const d = this.translateDimensionToPx(width, height, element, parent, true)
        
        return { x: p.x, y: p.y, width: d.width, height: d.height, aspectRatio }
    }
    
    setCoordinates(x, y) {
        const element = this.getElement()
        const parent = this.props.getParentDimension()
        const anchor = this.translateAnchorToPx(x, y, element, parent, false)
        this.handlePropertyChange('position', 'x', anchor.x)
        this.handlePropertyChange('position', 'y', anchor.y)
    }
    
    setTemporaryCoordinates(x, y) {
        const element = this.getElement()
        const parent = this.props.getParentDimension()
        const anchor = this.translateAnchorToPx(x, y, element, parent, false)
        this.setState({
            temporaryX: anchor.x,
            temporaryY: anchor.y
        })
    }
    
    setDimension(width, height, newX, newY) {
        const element = this.getElement()
        const parent = this.props.getParentDimension()
        
        width = width.replace('px', '')
        height = height.replace('px', '')
        
        const d = this.translateDimensionToPx(width, height, element, parent, false)
        this.handlePropertyChange('position', 'width', d.width)
        this.handlePropertyChange('position', 'height', d.height)
        this.setCoordinates(newX, newY)
    }
    
    setTemporaryDimension(width, height) {
        const element = this.getElement()
        const parent = this.props.getParentDimension()
        
        width = width.replace('px', '')
        height = height.replace('px', '')
        
        const d = this.translateDimensionToPx(width, height, element, parent, false)
        this.setState({
            temporaryW: d.width,
            temporaryH: d.height
        })
    }
    
    dragStop(e, d) {
        this.setCoordinates(d.x, d.y)
        this.setState({isDragging: false})
        this.props.setCenterRuler(false, false)
    }
    
    renderPositionSpec(parent) {
        let {temporaryX, temporaryY, temporaryW, temporaryH, isResizing} = this.state
        const element = this.getElement()
        const {xAnchor, yAnchor, widthType, heightType} = element.position
        const xType = (xAnchor == 'percent') ? '%' : 'px'
        const yType = (yAnchor == 'percent') ? '%' : 'px'
        const wType = (widthType == 'percent') ? '%' : 'px'
        const hType = (heightType == 'percent') ? '%' : 'px'
        
        let spec = `X: ${Math.round(temporaryX * 100) / 100}${xType} Y: ${Math.round(temporaryY, 2)}${yType}`
        if (isResizing) spec = `W: ${Math.round(temporaryW * 100) / 100}${wType} H: ${Math.round(temporaryH, 2)}${hType}}`
        return (
            <span style={this.getSpecStyle(element)}>{spec}</span>
        )
    }
    
    renderDistanceRuler(parent) {
        const element = this.getElement()
        let {temporaryX, temporaryY, isDragging} = this.state
        let {width, height, xAnchor, yAnchor, widthType, heightType} = element.position
        
        if (!isDragging) return
        
        temporaryX = (xAnchor == 'percent') ? positionToPx(parent.parentWidth, width, temporaryX) : temporaryX
        temporaryY = (yAnchor == 'percent') ? positionToPx(parent.parentHeight, height, temporaryY) : temporaryY
        width = (widthType == 'percent') ? dimensionToPx(parent.parentWidth, width) : width
        height = (heightType == 'percent') ? dimensionToPx(parent.parentHeight, height) : height
        
        let rulerContainer = {
            position: 'absolute',
            width: temporaryX + width / 2,
            height: temporaryY + height / 2,
            left: (xAnchor == 'left') ? -temporaryX : width - width / 2,
            top: (yAnchor == 'top') ? -temporaryY : height - height / 2,
        }
        
        let rulerWrapper = {
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'relative'
        }
        let verticalLine = {
            position: 'absolute',
            height: `calc(100% - ${height / 2}px)`,
            width: '1px',
            backgroundColor: keys.APP_COLOR,
            top: (yAnchor == 'top') ? 0 : null,
            bottom: (yAnchor == 'bottom') ? 0 : null,
            left: (xAnchor == 'right') ? 0 : null,
            right: (xAnchor == 'left') ? 0 : null
        }
        let horizontalLine = {
            position: 'absolute',
            width: `calc(100% - ${width / 2}px)`,
            height: '1px',
            backgroundColor: keys.APP_COLOR,
            top: (yAnchor == 'bottom') ? 0 : null,
            bottom: (yAnchor == 'top') ? 0 : null,
            left: (xAnchor == 'left') ? 0 : null,
            right: (xAnchor == 'right') ? 0 : null
        }
        
        const positiveOverflowX = (rulerContainer.width >= parent.parentWidth)
        const positiveOverflowY = (rulerContainer.height >= parent.parentHeight)
        const negativeOverflow = (rulerContainer.width <= 0 || rulerContainer.height <= 0)
        const hideVertical = (yAnchor == 'percent' || negativeOverflow || positiveOverflowX)
        const hideHorizontal = (xAnchor == 'percent' || negativeOverflow || positiveOverflowY)
        return (
            <div style={rulerContainer}>
                <div style={rulerWrapper}>
                    {hideVertical ? null : <div style={verticalLine}></div>}
                    {hideHorizontal ? null : <div style={horizontalLine}></div>}
                </div>
            </div>
        )
    }
    
    render() {
        let {children, state, setState, element, sectionElement, rndScale} = this.props
        const parent = this.props.getParentDimension()
        const { x, y, width, height, aspectRatio } = this.getPosition(parent)
        const {selectedSectionElement} = state
        
        return (
            <Rnd
                minWidth={1}
                minHeight={1}
                onClick={(e) => { 
                    e.stopPropagation()
                    this.handleSelect()
                }}
                scale={rndScale}
                style={this.getRndStyle()}
                size={{width,height}}
                position={{x,y}}
                onDragStart={() => this.handleSelect()}
                onDragStop={(e, d) => {
                    if (typeof selectedSectionElement !== 'undefined' && typeof sectionElement === 'undefined') {
                        return
                    }
                    this.dragStop(e, d)
                }}
                onResizeStart={() => this.handleSelect()}
                onResizeStop={(e, direction, ref, delta, position) => {
                    this.setDimension(
                        ref.style.width, 
                        ref.style.height,
                        position.x,
                        position.y
                    )
                    this.setState({isResizing: false})
                }}
                onDrag={(e, d) => {
                    e.stopImmediatePropagation()
                    this.handleSelect()
                    this.setTemporaryCoordinates(d.x, d.y)
                    this.setState({ isDragging: true })
                    this.setElementCenter(
                        d.x, d.y, width, height, parent
                    )
                }}
                onResize={(e, direction, ref, delta, position) => {
                    this.setTemporaryDimension(ref.style.width, ref.style.height)
                    this.setTemporaryCoordinates(position.x, position.y)
                    this.setState({ isResizing: true })
                    this.setElementCenter(
                        position.x, position.y, ref.style.width, ref.style.height, parent
                    )
                }}
                lockAspectRatio={aspectRatio}
            >
                <DraggableOptions
                    state={state}
                    element={element}
                    sectionElement={sectionElement}
                    setState={setState}
                />
                {this.renderPositionSpec(parent)}
                {this.renderDistanceRuler(parent)}
                {children}
            </Rnd>  
        )
    }
}

export default DraggableElement