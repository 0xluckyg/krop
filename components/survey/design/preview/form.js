import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import formStyle from '../../../../shared/survey-styles/form'
import keys from '../../../../config/keys'

class FormPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    getPlaceholder() {
        const placeholders = {}
        placeholders[keys.EMAIL_ELEMENT] = 'Email'
        placeholders[keys.PHONE_ELEMENT] = 'Phone number'
        placeholders[keys.FORM_ELEMENT] = 'Please put your answer here'
        placeholders[keys.LONG_FORM_ELEMENT] = 'Please put your answer here'
        
        const form = this.getElement()
        return placeholders[form.type]
    }
    
    renderQuestion() {
        const {classes} = this.props
        const form = this.getElement()
        const noQuestionList = [keys.EMAIL_ELEMENT, keys.PHONE_ELEMENT]
        if (noQuestionList.includes(form.type)) return null
        return (
            <p className={classes.questionStyle}>
                {form.question}
            </p>
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                <input 
                    className={classes.formStyle}
                    placeholder={this.getPlaceholder()} 
                />
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

const useStyles = theme => ({
    containerStyle: props => {
        let style = isDesktop(props) ? formStyle.CONTAINER_DESKTOP : formStyle.CONTAINER
        return {
            ...style
        }
    },
    questionStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? formStyle.QUESTION_DESKTOP : formStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
        }
    },
    formStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? formStyle.FORM_DESKTOP : formStyle.FORM
        return {
            ...style,
            font: font,
            color: textColor,
            '&:focus': {
                ...style.FOCUS  
            },
            '&::placeholder': {
                ...style.PLACEHOLDER,
                fontFamily: font
            }
        }
    }
});

export default withStyles(useStyles)(FormPreview)