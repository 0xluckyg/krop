import React, {Fragment} from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class AlertPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    isEditing() {
        return this.props.state.selectedElement == keys.ALERT
    }
    
    getElement() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }
    
    handleAlertClick(e) {
        e.stopPropagation()
        this.props.setState({
            selectedElement: keys.ALERT,
        })
    }
    
    getStyle() {
        const {state, classes} = this.props
        const {playAnimation} = state
        const animateShow = playAnimation == keys.SHOW ? classes.showAnimation : ''
        const animateExit = playAnimation == keys.EXIT ? classes.exitAnimation : ''
        return clsx(classes.alertStyle, classes.transitionAnimation, animateShow, animateExit)
    }
    
    render() {
        if (!this.isEditing()) return null
        const alertElement = this.getElement()
        
        return (
            <Fragment>
                <div 
                    className={this.getStyle()} 
                    onClick={(e) => this.handleAlertClick(e)}
                >
                    <span>{alertElement.text.label}</span>
                </div>
            </Fragment>
        )
    }
}

function getElementFromProps(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

function getAlertStyle(props) {
    const alertElement = getElementFromProps(props)
    const {color, cornerRounding, borderColor, borderWidth, opacity, shadow, shadowColor, padding} = alertElement.style
    const text = alertElement.text
    
    const devicePosition = (props.state.viewMode == keys.MOBILE_PROPERTY && alertElement.mobile && alertElement.mobile.enabled) ? keys.MOBILE_PROPERTY : keys.POSITION_PROPERTY
    let {x, y, width, height, xAnchor, yAnchor, widthType, heightType, rotate, scale} = alertElement[devicePosition]
    
    let left = (xAnchor == 'left') ? x : null
    const right = (xAnchor == 'right') ? x : null
    let top = (yAnchor == 'top') ? y : null
    const bottom = (yAnchor == 'bottom') ? y : null
    
    left = (xAnchor == 'percent') ? `${x}%` : left
    top = (yAnchor == 'percent') ? `${y}%` : top
    width = (widthType == 'percent') ? `${width}%` : width
    height = (heightType == 'percent') ? `${height}%` : height
    
    let transformX = (xAnchor == 'percent') ? -x : 0
    let transformY = (yAnchor == 'percent') ? -y : 0
    
    const t = `translate(${transformX}%, ${transformY}%)`
    const r = `rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`
    const s = `scale(${scale ? scale : 1})`
    const transform = `${t} ${s} ${r}`
    
    let alertStyle = {
        minWidth: width, 
        minHeight: height,
        left, right, top, bottom,
        transform,
        backgroundColor: color,
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        borderColor,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        opacity,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
        fontFamily: text.font,
        color: text.color,
        fontSize: text.size,
        textAlign: 'center',
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return alertStyle
}

const useStyles = theme => ({    
    alertStyle: props => {
        return {
            ...getAlertStyle(props),
            position: 'absolute'
        }
    }
})

export default withStyles(useStyles)(AlertPreview)