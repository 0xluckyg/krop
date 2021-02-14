import React from 'react'
import clsx from 'clsx'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import nameStyle from '../../../../shared/campaign-styles/name'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import formStyle from '../../../../shared/campaign-styles/form'
import alertStyle from '../../../../shared/campaign-styles/alert'
import keys from '../../../../config/keys'

let strings = new LocalizedStrings({
    en:{
        nameLabel: "Name",
        alertLabel: "* Please give a valid name",
        firstNameLabel: "First name",
        lastNameLabel: "Last name"
    },
    kr: {
        nameLabel: "이름",
        alertLabel: "* 올바른 이름을 적어 주세요",
        firstNameLabel: "이름",
        lastNameLabel: "성"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class NamePreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    renderTitle() {
        const {classes} = this.props
        return (
            <p className={classes.titleStyle}>
                {strings.nameLabel}
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
                {this.renderTitle()}
                <div className={classes.nameWrapperStyle}>
                    <input 
                        className={clsx(classes.frontNameStyle, classes.nameStyle)}
                        placeholder={strings.firstNameLabel}
                    />
                    <input 
                        className={classes.nameStyle}
                        placeholder={strings.lastNameLabel}
                    />
                </div>
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
    titleStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? elementStyle.QUESTION_DESKTOP : elementStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
        }
    },
    nameWrapperStyle: props => {
        let style = isDesktop(props) ? nameStyle.NAME_WRAPPER_DESKTOP : nameStyle.NAME_WRAPPER_DESKTOP
        return {
            ...style
        }
    },
    frontNameStyle: props => {
        let style = isDesktop(props) ? nameStyle.FRONT_NAME_DESKTOP : nameStyle.FRONT_NAME
        return {
            ...style
        }
    },
    nameStyle: props => {
        const {font, textColor} = getStyle(props)
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

export default withStyles(useStyles)(NamePreview)