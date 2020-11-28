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
        let style = isDesktop(props) ? buttonStyles.CONTAINER_DESKTOP : buttonStyles.CONTAINER
        return {
            ...style
        }  
    },
    buttonStyle: props => {
        let style = isDesktop(props) ? buttonStyles.BUTTON_DESKTOP : buttonStyles.BUTTON
        const {primaryColor} = getStyle(props)
        return {
            color: primaryColor,
            ...style
        }
    },
})

export default withStyles(useStyles)(ButtonPreview)