import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import nameStyle from '../../../../shared/survey-styles/name'
import keys from '../../../../config/keys'

class NAMEPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                <input 
                    className={clsx(classes.frontNameStyle, classes.nameStyle)}
                    placeholder="First name"
                />
                <input 
                    className={classes.nameStyle}
                    placeholder="Last name"
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
        let style = isDesktop(props) ? nameStyle.CONTAINER_DESKTOP : nameStyle.CONTAINER
        return {
            ...style
        }
    },
    questionStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? nameStyle.QUESTION_DESKTOP : nameStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
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
        let style = isDesktop(props) ? nameStyle.NAME_DESKTOP : nameStyle.NAME
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

export default withStyles(useStyles)(NAMEPreview)