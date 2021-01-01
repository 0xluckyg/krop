import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import textStyles from '../../../../shared/survey-styles/text'

class TextPreview extends React.Component {
    constructor(props) {
        super(props)
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

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
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
        let style = isDesktop(props) ? textStyles.HEADING_DESKTOP : textStyles.HEADING
        return getTextStyle(props, style)
    },
    subheadingStyle: props => {
        let style = isDesktop(props) ? textStyles.SUBHEADING_DESKTOP : textStyles.SUBHEADING
        return getTextStyle(props, style)
    },
    paragraphStyle: props => {
        let style = isDesktop(props) ? textStyles.PARAGRAPH_DESKTOP : textStyles.PARAGRAPH
        return getTextStyle(props, style)
    }
})

export default withStyles(useStyles)(TextPreview)