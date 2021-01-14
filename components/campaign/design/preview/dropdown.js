import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import dropdownStyle from '../../../../shared/campaign-styles/dropdown'
import alertStyle from '../../../../shared/campaign-styles/alert'

let strings = new LocalizedStrings({
    en:{
        placeholderLabel: "* Please select an option",
        defaultOptionLabel: "Please select one",
    },
    kr: {
        placeholderLabel: "* 항목을 선택해 주세요",
        placeholderLabel: "항목을 선택해 주세요"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class SelectorPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    renderQuestion() {
        const {classes} = this.props
        const dropdown = this.getElement()
        return <p className={classes.questionStyle}>
            {dropdown.question}
        </p>
    }
    
    renderOptions() {
        const {classes} = this.props
        const dropdown = this.getElement()
        return <div className={classes.dropdownWrapperStyle}>
            <select className={classes.dropdownStyle}>
                <option className={classes.optionStyle}>{strings.defaultOptionLabel}</option>
                {
                    dropdown.options.map((o, i)=> {
                        return <option className={classes.optionStyle} key={o + i}>{o.text}</option>
                    })
                }
            </select>
        </div>
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>{strings.placeholderLabel}</p>
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {this.renderOptions()}
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
    dropdownWrapperStyle: props => {
        const {primaryColor} = getStyle(props)
        let style = isDesktop(props) ? dropdownStyle.DROPDOWN_WRAPPER_DESKTOP : dropdownStyle.DROPDOWN_WRAPPER
        return {
            ...style,
            '&:after': {
                ...style.AFTER,
                // background: secondaryColor,
                color: primaryColor,
            }
        }
    },
    dropdownStyle: props => {
        const {font, textColor, primaryColor} = getStyle(props)
        let style = isDesktop(props) ? dropdownStyle.DROPDOWN_DESKTOP : dropdownStyle.DROPDOWN
        return {
            ...style,
            margin: 0,
            borderColor: textColor,
            backgroundColor: 'transparent',
            fontFamily: font, 
            color: textColor
        }
    },
    optionStyle: props => {
        const {backgroundColor,textColor} = getStyle(props)
        return {
            backgroundColor,
            color: textColor
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
})

export default withStyles(useStyles)(SelectorPreview)