import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'

import keys from '../../../../config/keys'
import mcStyle from '../../../../shared/campaign-styles/multiple-choice'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import alertStyle from '../../../../shared/campaign-styles/alert'

let strings = new LocalizedStrings({
    us:{
        alertLabel: "* Please select an option"
    },
    kr: {
        alertLabel: "* 옵션을 선택해 주세요"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class MultipleChoicePreview extends React.Component {
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
                            <input className={classes.radioStyle} type="radio" name="mc" value={o.text}/>
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
            <p className={classes.alertStyle}>{strings.alertLabel}</p>
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
        let style = isDesktop(props) ? mcStyle.OPTION_CONTAINER_DESKTOP : mcStyle.OPTION_CONTAINER
        let hover = isDesktop(props) ? mcStyle.OPTION_CONTAINER_DESKTOP.HOVER : mcStyle.OPTION_CONTAINER.HOVER
        let active = isDesktop(props) ? mcStyle.OPTION_CONTAINER_DESKTOP.ACTIVE : mcStyle.OPTION_CONTAINER.ACTIVE
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
        let style = isDesktop(props) ? mcStyle.OPTION_WRAPPER_DESKTOP : mcStyle.OPTION_WRAPPER
        return {
            ...style
        }
    },
    radioStyle: props => {
        const {primaryColor} = getStyle(props)
        let style = isDesktop(props) ? mcStyle.RADIO_DESKTOP : mcStyle.RADIO
        let before = isDesktop(props) ? mcStyle.RADIO_DESKTOP.BEFORE : mcStyle.RADIO.BEFORE
        let after = isDesktop(props) ? mcStyle.RADIO_DESKTOP.AFTER : mcStyle.RADIO.AFTER
        let checked = isDesktop(props) ? mcStyle.RADIO_DESKTOP.CHECKED_AFTER : mcStyle.RADIO.CHECKED_AFTER
        return {
            ...style,
            '&:before': {
                ...before,
                borderColor: primaryColor,
                borderRadius: 15,
                borderWidth: 1.5,
                // width: '100%',
                // height: '100%'
            },
            '&:after': {
                ...after,
                borderRadius: 15
            },
            '&:checked:after': {
                ...checked,
                backgroundColor: primaryColor,
                // borderColor: primaryColor
            }
        }
    },
    textStyle: props => {
        const {font, textColor} = getStyle(props)
        let text = isDesktop(props) ? elementStyle.TEXT_DESKTOP : elementStyle.TEXT
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

export default withStyles(useStyles)(MultipleChoicePreview)