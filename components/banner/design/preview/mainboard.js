import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class MainboardPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getMainboard() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }
    
    handleMainboardClick(e) {
        e.stopPropagation()
        this.props.setState({
            selectedElement: keys.MAINBOARD_ELEMENT,
        })
    }
    
    render() {
        const {classes} = this.props
        return (
            <div
                className={classes.mainboardStyle}>
                <div 
                    className={classes.mainboardWrapper}
                    onClick={e => this.handleMainboardClick(e)}
                >
                    {this.props.children}
                </div>
            </div>
        )
    }
}

function getElementFromProps(props) {
    return getElement({props, selectedStage: 0, selectedElement: keys.MAINBOARD_ELEMENT})
}

function getMainboardStyle(props) {    
    const mainboard = getElementFromProps(props)
    const {color, cornerRounding, opacity, padding, margin} = mainboard.style
    
    let {x, y, width, height, xAnchor, yAnchor, widthType, heightType, rotate, scale} = mainboard.position

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
    const s = `scale(${scale ? scale : 1})`
    const transform = `${t} ${s}`
        
    const backgroundImage = (mainboard.image != '') ? `url(${mainboard.image})` : 'none'
    let mainboardStyle = {
        overflow: 'hidden',
        backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width, height,
        left, right, top, bottom,
        transform,
        backgroundColor: color,
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        position: 'fixed',
        opacity,
    }

    return mainboardStyle
}


const useStyles = theme => ({
    mainboardWrapper: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    mainboardStyle: props => {
        return {
            ...getMainboardStyle(props),
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        }
    }
})

export default withStyles(useStyles)(MainboardPreview)