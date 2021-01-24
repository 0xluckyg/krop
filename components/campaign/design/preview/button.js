import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import buttonStyles from '../../../../shared/campaign-styles/button'
import {elementsToPages} from '../element-editor/sub/functions'

let strings = new LocalizedStrings({
    en:{
        buttonLabel: "Continue"
    },
    kr: {
        buttonLabel: "다음"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ButtonPreview extends React.Component {
    constructor(props) {
        super(props)
    }

    hideButton() {
        const {stages, selectedStage, selectedPage} = this.props.state
        const stage = stages[selectedStage]
        const pages = elementsToPages(stage.elements)
        if (selectedStage < stages.length - 1) return false
        if (stage.settings.questionPerPage && (selectedPage < pages.length - 1)) return false
        return true
    }

    renderContinueButton() {
        const {classes} = this.props
        return (
            <button 
                className={classes.buttonStyle}
            >
                {strings.buttonLabel}
            </button>
        )
    }

    render() {
        const {classes, state} = this.props
        if (this.hideButton()) return null
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
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
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