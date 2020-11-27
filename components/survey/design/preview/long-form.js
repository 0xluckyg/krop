import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import Draggable  from './sub/draggable-element'
import {modifyProperty} from './sub/functions'
import {keyframes, showAnimation, exitAnimation, transitionAnimation}  from './animation/animation-style'
import {getElement} from '../element-editor/sub/functions'

import keys from '../../../config/keys'

class TextareaPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    handleFormChange(event) {
        const {selectedStage, selectedElement} = this.props.state
        modifyProperty({
            props: this.props, selectedStage, selectedElement, propertyType: keys.TEXT_PROPERTY, property: 'label', value: event.target.value
        })
    }
    
    getStyle() {
        const {state, classes} = this.props
        const {playAnimation} = state
        const animateShow = playAnimation == keys.SHOW ? classes.showAnimation : ''
        const animateExit = playAnimation == keys.EXIT ? classes.exitAnimation : ''
        return clsx(classes.textareaWrapperStyle, classes.transitionAnimation, animateShow, animateExit)
    }
    
    renderQuestion() {
        const {classes} = this.props
        const textarea = this.getElement()
        if (!textarea.questionStyle.enabled) return
        return <p className={classes.questionStyle}>
            {textarea.question}
        </p>
    }
    
    renderTextarea() {
        const {classes} = this.props
        const textarea = this.getElement()
        return <textarea 
            onChange={this.handleFormChange.bind(this)}
            value={textarea.text.label} 
            className={classes.textareaStyle} 
            placeholder={textarea.placeholder.label} 
        />
    }
    
    render() {
        const {zIndex, state, setState, stage, element, setCenterRuler, getParentDimension, sectionElement, rndScale} = this.props

        return (
            <Draggable
                state={state}
                setState={setState}
                stage={stage}
                element={element}
                sectionElement={sectionElement}
                zIndex={zIndex}
                setCenterRuler={setCenterRuler}
                getParentDimension={getParentDimension}
                rndScale={rndScale}
            >
                <div className={this.getStyle()}>
                    {this.renderQuestion()}
                    {this.renderTextarea()}
                </div>
            </Draggable>
        )
    }
}

function getElementFromProps(props) {
    let {stage, element, sectionElement} = props
    return getElement({props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
}

function getTextareaWrapperStyle(props) {
    const textarea = getElementFromProps(props)
    const devicePosition = (props.state.viewMode == keys.MOBILE_PROPERTY && textarea.mobile && textarea.mobile.enabled) ? keys.MOBILE_PROPERTY : keys.POSITION_PROPERTY
    const {rotate, scale} = textarea[devicePosition]
    const {opacity} = textarea.style
    
    return {
        transform: `scale(${scale ? scale : 1}) rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`,
        opacity,
        width: '100%'
    }
}

function getTextareaStyle(props) {
    const textarea = getElementFromProps(props)
    const {color, cornerRounding, borderColor, borderWidth, padding, opacity, shadow, shadowColor, margin, height} = textarea.style
    const text = textarea.text
    
    return {
        resize: 'none',
        width: '100%',
        height,
        backgroundColor: color,
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        borderColor,
        fontFamily: text.font,
        color: text.color,
        fontSize: text.size,
        font: text.font,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
    }
}

const useStyles = theme => ({
    ...keyframes,
    ...showAnimation,
    ...exitAnimation,
    ...transitionAnimation,
    
    questionStyle: props => {
        const textarea = getElementFromProps(props)
        if (!textarea || !textarea.questionStyle) return
        const style = textarea.questionStyle
        const {size, font, color} = style
        const {padding, margin} = textarea.style
        return {
            padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
            margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
            fontSize: size, 
            fontFamily: font, 
            color
        }
    },
    textareaWrapperStyle: props => {
        return {...getTextareaWrapperStyle(props)}  
    },
    textareaStyle: inputProps => {
        const {placeholder} = getElementFromProps(inputProps)
        return {
            ...getTextareaStyle(inputProps),
            '&:focus': {
                outline: 'none'  
            },
            '&::placeholder': {
                color: placeholder.color,
                fontSize: placeholder.size,
                fontFamily: placeholder.font
            }
        }
    }
});

export default withStyles(useStyles)(TextareaPreview)