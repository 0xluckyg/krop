import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import nameStyle from '../../../../shared/survey-styles/name'
import elementStyle from '../../../../shared/survey-styles/reusable'
import formStyle from '../../../../shared/survey-styles/form'
import keys from '../../../../config/keys'

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
                Name
            </p>
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
                        placeholder="First name"
                    />
                    <input 
                        className={classes.nameStyle}
                        placeholder="Last name"
                    />
                </div>
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
    }
});

export default withStyles(useStyles)(NamePreview)