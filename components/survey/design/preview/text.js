import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import staticStyles from '../../../../shared/survey-styles/static'

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
        let style = isDesktop(props) ? staticStyles.HEADING_DESKTOP : staticStyles.HEADING
        return getTextStyle(props, style)
    },
    subheadingStyle: props => {
        let style = isDesktop(props) ? staticStyles.SUBHEADING_DESKTOP : staticStyles.SUBHEADING
        return getTextStyle(props, style)
    },
    paragraphStyle: props => {
        let style = isDesktop(props) ? staticStyles.PARAGRAPH_DESKTOP : staticStyles.PARAGRAPH
        return getTextStyle(props, style)
    }
})

export default withStyles(useStyles)(TextPreview)