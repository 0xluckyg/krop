import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'

import keys from '../../../../config/keys'
import elementStyle from '../../../../shared/survey-styles/reusable'
import checkboxStyle from '../../../../shared/survey-styles/checkbox'
import alertStyle from '../../../../shared/survey-styles/alert'

class CheckboxPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    getStyle() {
        const {classes} = this.props
        return classes.containerStyle
    }
    
    renderQuestion() {
        const {classes} = this.props
        const mc = this.getElement()
        return <p className={classes.questionStyle}>
            {mc.question}
        </p>
    }
    
    renderOptions() {
        const {classes} = this.props
        const mc = this.getElement()
        if (!mc.options) return
        return <React.Fragment>
            {
                mc.options.map((o, i)=> {
                    return <div key={o.text + i}className={classes.optionContainer}>
                        <label className={classes.optionWrapper}>
                            <input className={classes.radioStyle} type="checkbox" name="mc" value={o.text}/>
                            <p className={classes.textStyle}>{o.text}</p>
                        </label>
                    </div>
                })
            }
        </React.Fragment>
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>* Please select an option</p>
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
    optionContainer: props => {
        let style = isDesktop(props) ? checkboxStyle.OPTION_CONTAINER_DESKTOP : checkboxStyle.OPTION_CONTAINER
        let hover = isDesktop(props) ? checkboxStyle.OPTION_CONTAINER_DESKTOP.HOVER : checkboxStyle.OPTION_CONTAINER.HOVER
        let active = isDesktop(props) ? checkboxStyle.OPTION_CONTAINER_DESKTOP.ACTIVE : checkboxStyle.OPTION_CONTAINER.ACTIVE
        return {
            ...style,
            '&:hover': {
                ...hover
            },
            '&:active': {
                ...active
            }
        }
    },
    optionWrapper: props => {
        let style = isDesktop(props) ? checkboxStyle.OPTION_WRAPPER_DESKTOP : checkboxStyle.OPTION_WRAPPER
        return {
            ...style
        }
    },
    radioStyle: props => {
        const {primaryColor} = getStyle(props)
        let style = isDesktop(props) ? checkboxStyle.RADIO_DESKTOP : checkboxStyle.RADIO
        let before = isDesktop(props) ? checkboxStyle.RADIO_DESKTOP.BEFORE : checkboxStyle.RADIO.BEFORE
        let after = isDesktop(props) ? checkboxStyle.RADIO_DESKTOP.AFTER : checkboxStyle.RADIO.AFTER
        let checked = isDesktop(props) ? checkboxStyle.RADIO_DESKTOP.CHECKED_AFTER : checkboxStyle.RADIO.CHECKED_AFTER
        return {
            ...style,
            '&:before': {
                ...before,
                borderColor: primaryColor,
                borderWidth: 1.5
            },
            '&:after': {
                ...after,
                backgroundColor: 'transparent',
            },
            '&:checked:after': {
                ...checked,
                backgroundColor: primaryColor
            }
        }
    },
    textStyle: props => {
        const {font, textColor} = getStyle(props)
        let text = isDesktop(props) ? checkboxStyle.TEXT_DESKTOP : checkboxStyle.TEXT
        return {
            ...text,
            fontFamily: font, 
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

export default withStyles(useStyles)(CheckboxPreview)