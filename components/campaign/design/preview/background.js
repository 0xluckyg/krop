import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import frameStyles from '../../../../shared/campaign-styles/frame'

class BackgroundPreview extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {children, classes} = this.props
        return (
            <div 
                className={classes.backgroundStyle}
            >
                {children}
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
    backgroundStyle: props => {
        let {backgroundColor, backgroundImage} = getStyle(props)
        let style = isDesktop(props) ? frameStyles.BACKGROUND_DESKTOP : frameStyles.BACKGROUND
        backgroundImage = (backgroundImage != '') ? `url(${backgroundImage})` : 'none'
        
        return {
            backgroundImage,
            backgroundColor,
            ...style
        }
    }
})

export default withStyles(useStyles)(BackgroundPreview)