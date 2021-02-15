import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import LocalizedStrings from 'react-localization';

import {getElement} from '../element-editor/sub/functions'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import formStyle from '../../../../shared/campaign-styles/form'
import keys from '../../../../config/keys'
import alertStyle from '../../../../shared/campaign-styles/alert'

let strings = new LocalizedStrings({
    us:{
        emailLabel: "Email",
        phoneLabel: "Phone",
        phoneNumberLabel: "Phone number",
        answerLabel: "Please put your answer here",
        alertLabel: "* Error preview"
    },
    kr: {
        emailLabel: "이메일",
        phoneLabel: "번호",
        phoneNumberLabel: "전화번호",
        answerLabel: "답변을 입력해 주세요!",
        alertLabel: "* 오류 입니다"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

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
        placeholders[keys.EMAIL_ELEMENT] = strings.emailLabel
        placeholders[keys.PHONE_ELEMENT] = strings.phoneLabel
        placeholders[keys.FORM_ELEMENT] = strings.answerLabel

        const form = this.getElement()
        return placeholders[form.type]
    }
    
    getTitle() {
        const form = this.getElement()
        
        const titles = {}
        titles[keys.EMAIL_ELEMENT] = strings.emailLabel
        titles[keys.PHONE_ELEMENT] = strings.phoneNumberLabel
        titles[keys.FORM_ELEMENT] = form.question

        return titles[form.type]
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
                {this.getTitle()}
            </p>
        )
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>{strings.alertLabel}</p>
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

export default withStyles(useStyles)(FormPreview)