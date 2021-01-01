import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import referralStyles from '../../../../shared/survey-styles/referral'
import elementStyle from '../../../../shared/survey-styles/reusable'

class ReferralPreview extends React.Component {
    constructor(props) {
        super(props)
    }

    getElement() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderQuestion() {
        const {classes} = this.props
        const referral = this.getElement()
        return <p className={classes.questionStyle}>
            {referral.question}
        </p>
    }

    renderReferButton() {
        const {classes} = this.props
        let referralElement = this.getElement()
        return (
            <button 
                className={classes.referralStyle}
            >
                {referralElement.text}
            </button>
        )
    }
    

    render() {
        const {classes, state} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {this.renderReferButton()}
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
        let style = isDesktop(props) ? referralStyles.REFERRAL_CONTAINER_DESKTOP : referralStyles.REFERRAL_CONTAINER
        
        return {
            backgroundColor,
            ...style,
            '&:hover': {
                ...style.HOVER
            }
        }  
    },
    questionStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? elementStyle.QUESTION_DESKTOP : elementStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
        }
    },
    referralStyle: props => {
        let style = isDesktop(props) ? referralStyles.REFERRAL_BUTTON_DESKTOP : referralStyles.REFERRAL_BUTTON
        const {primaryColor, align} = getStyle(props)
        
        let textAlign = 'center'
        if (align == 'left') {
            textAlign = 'left'
        } else if (align == 'right') {
            textAlign = 'right'
        }
        
        return {
            textAlign,
            color: 'rgba(0,0,0,0.9)',
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

export default withStyles(useStyles)(ReferralPreview)