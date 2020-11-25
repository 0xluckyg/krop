import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import surveyStyles from '../../../../shared/survey-styles/survey'

class TextPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getText() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderText() {
        let {stage, element, classes} = this.props
        let textElement = getElement({
            props: this.props, selectedStage: stage, selectedElement: element
        })
        
        if (textElement.type == keys.HEADING_ELEMENT) {
            return <h1 className={classes.headingStyle}>{textElement.text}</h1>
        } else if (textElement.type == keys.SUBHEADING_ELEMENT) {
            return <h3 className={classes.subheadingStyle}>{textElement.text}</h3>
        } else {
            return <p className={classes.paragraphStyle}>{textElement.text}</p>
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
    headingStyle: props => {
        return getTextStyle(props, surveyStyles.HEADING)
    },
    headingMobileStyle: props => {
        return getTextStyle(props, surveyStyles.HEADING)
    },
    subheadingStyle: props => {
        return getTextStyle(props, surveyStyles.SUBHEADING)
    },
    subheadingMobileStyle: props => {
        return getTextStyle(props, surveyStyles.SUBHEADING)
    },
    paragraphStyle: props => {
        return getTextStyle(props, surveyStyles.PARAGRAPH)
    },
    paragraphMobileStyle: props => {
        return getTextStyle(props, surveyStyles.PARAGRAPH)
    }
})

export default withStyles(useStyles)(TextPreview)