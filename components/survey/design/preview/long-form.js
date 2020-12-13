import React from 'react'
import TextareaAutosize from 'react-autosize-textarea';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import elementStyle from '../../../../shared/survey-styles/reusable'
import formStyle from '../../../../shared/survey-styles/form'
import keys from '../../../../config/keys'
import alertStyle from '../../../../shared/survey-styles/alert'

class LongFormPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    noQuestion() {
        const form = this.getElement()
        const noQuestionList = [keys.EMAIL_ELEMENT, keys.PHONE_ELEMENT]
        return noQuestionList.includes(form.type) ? false : true
    }
    
    renderQuestion() {
        const {classes} = this.props
        return (
            <p className={classes.questionStyle}>
                {this.getElement().question}
            </p>
        )
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>* Please type an answer</p>
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                <TextareaAutosize
                    placeholder={'Please put your answer here'} 
                    type="text"
                    className={classes.formStyle}
                />
                {this.renderAlert()}
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

function getAlert(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.ALERT_SETTINGS})
}

const useStyles = theme => ({
    containerStyle: props => {
        let style = isDesktop(props) ? elementStyle.CONTAINER_DESKTOP : elementStyle.CONTAINER
        return {
            ...style
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
    formStyle: props => {
        const {font, textColor, primaryColor} = getStyle(props)
        let style = isDesktop(props) ? formStyle.FORM_DESKTOP : formStyle.FORM
        return {
            ...style,
            font: font,
            color: textColor,
            borderColor: textColor,
            '&:focus': {
                ...style.FOCUS  
            },
            '&::placeholder': {
                ...style.PLACEHOLDER,
                color: textColor,
                fontFamily: font
            }
        }
    },
    alertStyle: props => {
        const {textColor} = getAlert(props)
        const {font, primaryColor} = getStyle(props)
        let style = isDesktop(props) ? alertStyle.ALERT_TEXT_DESKTOP : alertStyle.ALERT_TEXT
        return {
            ...style,
            font: font,
            color: textColor
        }
    }
});

export default withStyles(useStyles)(LongFormPreview)