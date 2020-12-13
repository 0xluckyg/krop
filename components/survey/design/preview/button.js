import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import buttonStyles from '../../../../shared/survey-styles/button'

class ButtonPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getImage() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderContinueButton() {
        const {classes} = this.props
        return (
            <button 
                className={classes.buttonStyle}
            >
                Continue
            </button>
        )
    }

    render() {
        const {classes, state} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderContinueButton()}
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

const useStyles = theme => ({
    containerStyle: props => {
        const {backgroundColor, align} = getStyle(props)
        let style = isDesktop(props) ? buttonStyles.BUTTON_CONTAINER_DESKTOP : buttonStyles.BUTTON_CONTAINER
        
        let justifyContent = 'center'
        if (align == 'left') {
            justifyContent = 'flex-start'
        } else if (align == 'right') {
            justifyContent = 'flex-end'
        }
        
        return {
            backgroundColor,
            justifyContent,
            ...style,
            '&:hover': {
                ...style.HOVER
            }
        }  
    },
    buttonStyle: props => {
        let style = isDesktop(props) ? buttonStyles.BUTTON_DESKTOP : buttonStyles.BUTTON
        const {primaryColor} = getStyle(props)
        return {
            color: primaryColor,
            ...style,
            '&:focus:': {
                ...style.FOCUS
            },
            '&:active': {
                ...style.ACTIVE
            }
        }
    },
})

export default withStyles(useStyles)(ButtonPreview)