import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import surveyStyles from '../../../../shared/survey-styles/static'

class BackgroundPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getBackground() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    render() {
        const {children, classes, state} = this.props
        const className = state.viewMode == keys.MOBILE_PROPERTY ? classes.backgroundMobileStyle : classes.backgroundDesktopStyle
        return (
            <div 
                className={className}
            >
                {children}
            </div>
        )
    }
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

const useStyles = theme => ({    
    backgroundMobileStyle: props => {
        let {backgroundColor, backgroundImage} = getStyle(props)
        backgroundImage = (backgroundImage != '') ? `url(${backgroundImage})` : 'none'
        
        return {
            backgroundImage,
            backgroundColor,
            ...surveyStyles.BACKGROUND
        }
    },
    backgroundDesktopStyle: props => {
        let {backgroundColor, backgroundImage} = getStyle(props)
        backgroundImage = (backgroundImage != '') ? `url(${backgroundImage})` : 'none'
        
        return {
            backgroundImage,
            backgroundColor,
            ...surveyStyles.BACKGROUND_DESKTOP
        }
    }
})

export default withStyles(useStyles)(BackgroundPreview)