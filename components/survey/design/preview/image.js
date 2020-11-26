import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import surveyStyles from '../../../../shared/survey-styles/static'

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
        const className = state.viewMode == keys.MOBILE_PROPERTY ? classes.imageMobileStyle : classes.imageDesktopStyle
        return (
            <img 
                src={this.getImage().url}
                className={className}
            />
        )
    }
}

function getStyle(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

const useStyles = theme => ({   
    imageMobileStyle: props => {
        let {rounding} = getStyle(props)
        return {
            borderRadius: rounding ? 20 : 0,
            ...surveyStyles.IMAGE
        }
    },
    imageDesktopStyle: props => {
        let {rounding} = getStyle(props)
        return {
            borderRadius: rounding ? 20 : 0,
            ...surveyStyles.IMAGE_DESKTOP
        }
    }
})

export default withStyles(useStyles)(ImagePreview)