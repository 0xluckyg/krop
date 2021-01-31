import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import imageUploadStyles from '../../../../shared/campaign-styles/image-upload'

class ImageUploadPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let {stage, element, classes} = this.props
        let linkElement = getElement({
            props: this.props, selectedStage: stage, selectedElement: element
        })
        return <div className={classes.imageUploadStyle}>
            {linkElement.url}
        </div>
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
    imageUploadStyle: props => {
        const {font, align} = getStyle(props)
        const {primaryColor} = getStyle(props)
        let style = isDesktop(props) ? imageUploadStyles.IMAGE_UPLOAD_DESKTOP : imageUploadStyles.IMAGE_UPLOAD
        return {
            fontFamily: font,
            textAlign: align,
            color: primaryColor,
            ...style,
            '&:before': {
                ...style.BEFORE,
                marginRight: 10
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

export default withStyles(useStyles)(ImageUploadPreview)