import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import linkStyles from '../../../../shared/survey-styles/link'

class LinkPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let {stage, element, classes} = this.props
        let linkElement = getElement({
            props: this.props, selectedStage: stage, selectedElement: element
        })
        return <a className={classes.linkStyle}>{linkElement.url}</a>
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
    linkStyle: props => {
        const {font, align} = getStyle(props)
        const {primaryColor} = getStyle(props)
        let style = isDesktop(props) ? linkStyles.LINK_DESKTOP : linkStyles.LINK
        return {
            fontFamily: font,
            textAlign: align,
            color: primaryColor,
            ...style,
            '&:before': {
                ...style.BEFORE
            },
            '&:hover': {
                ...style.HOVER
            },
            '&:active': {
                ...style.ACTIVE
            }
        }
    }
})

export default withStyles(useStyles)(LinkPreview)