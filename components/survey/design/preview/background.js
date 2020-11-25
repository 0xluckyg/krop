import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import surveyStyles from '../../../../shared/survey-styles/survey'

class BackgroundPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getBackground() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
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

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

const useStyles = theme => ({    
    backgroundStyle: props => {
        const {backgroundColor} = getStyle(props)
        return {
            backgroundColor,
            ...surveyStyles.BACKGROUND
        }
    }
})

export default withStyles(useStyles)(BackgroundPreview)