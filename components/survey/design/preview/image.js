import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import staticStyles from '../../../../shared/survey-styles/static'

class ImagePreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getImage() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    render() {
        const {classes, state} = this.props
        return (
            <img 
                src={this.getImage().url}
                className={classes.imageStyle}
            />
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

const useStyles = theme => ({   
    imageStyle: props => {
        let style = isDesktop(props) ? staticStyles.IMAGE_DESKTOP : staticStyles.IMAGE
        let {rounding} = getStyle(props)
        return {
            borderRadius: rounding ? 20 : 0,
            ...style
        }
    },
})

export default withStyles(useStyles)(ImagePreview)