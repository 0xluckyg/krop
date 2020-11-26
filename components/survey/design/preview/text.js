import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import surveyStyles from '../../../../shared/survey-styles/static'

class TextPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getText() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderText() {
        let {stage, element, classes, state} = this.props
        let textElement = getElement({
            props: this.props, selectedStage: stage, selectedElement: element
        })
        
        if (textElement.type == keys.HEADING_ELEMENT) {
            const className = state.viewMode == keys.MOBILE_PROPERTY ? classes.headingMobileStyle : classes.headingDesktopStyle
            return <h1 className={className}>{textElement.text}</h1>
        } else if (textElement.type == keys.SUBHEADING_ELEMENT) {
            const className = state.viewMode == keys.MOBILE_PROPERTY ? classes.subheadingMobileStyle : classes.subheadingDesktopStyle
            return <h3 className={className}>{textElement.text}</h3>
        } else {
            const className = state.viewMode == keys.MOBILE_PROPERTY ? classes.paragraphMobileStyle : classes.paragraphDesktopStyle
            return <p className={className}>{textElement.text}</p>
        }
    }

    render() {
        return <React.Fragment>
            {this.renderText()}
        </React.Fragment>
    }
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

function getTextStyle(props, type) {
    const {font, align, textColor} = getStyle(props)
    return {
        color: textColor,
        fontFamily: font,
        textAlign: align,
        ...type
    }
}

const useStyles = theme => ({    
    headingDesktopStyle: props => {
        return getTextStyle(props, surveyStyles.HEADING)
    },
    headingMobileStyle: props => {
        return getTextStyle(props, surveyStyles.HEADING)
    },
    subheadingDesktopStyle: props => {
        return getTextStyle(props, surveyStyles.SUBHEADING)
    },
    subheadingMobileStyle: props => {
        return getTextStyle(props, surveyStyles.SUBHEADING)
    },
    paragraphDesktopStyle: props => {
        return getTextStyle(props, surveyStyles.PARAGRAPH)
    },
    paragraphMobileStyle: props => {
        return getTextStyle(props, surveyStyles.PARAGRAPH)
    }
})

export default withStyles(useStyles)(TextPreview)