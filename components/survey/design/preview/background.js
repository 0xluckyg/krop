import React, {Fragment} from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class BackgroundPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getBackground() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    resetElementSelection() {
        this.props.setState({ selectedElement: null })
    }
    
    getStyle() {
        const {state, classes} = this.props
        const {playAnimation} = state
        const animateShow = playAnimation == keys.SHOW ? classes.showAnimation : ''
        const animateExit = playAnimation == keys.EXIT ? classes.exitAnimation : ''
        return clsx(classes.backgroundStyle, classes.transitionAnimation, animateShow, animateExit)
    }
    
    render() {
        const {children, classes} = this.props
        const background = this.getBackground()
        
        return (
            (background.enabled) ?
            <div 
                className={this.getStyle()}
                onClick={() => this.resetElementSelection()}
            >
                {children}
            </div> :
            <Fragment>
                {children}
            </Fragment>
        )
    }
}

function getElementFromProps(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

function getBackgroundStyle(props) {
    const background = getElementFromProps(props)
    const backgroundImage = (background.image != '') ? `url(${background.image})` : 'none'
    const {color, opacity} = background.style
    
    return {
        backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: color,
        opacity,
        overflow: background.overflow ? 'auto' : 'hidden'
    }
}

const useStyles = theme => ({    
    backgroundStyle: props => {
        return {
            ...getBackgroundStyle(props),
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            flex: 1
        }
    }
})

export default withStyles(useStyles)(BackgroundPreview)