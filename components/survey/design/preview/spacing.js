import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import spacingStyles from '../../../../shared/survey-styles/spacing'

class SpacingPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes} = this.props
        return (
            <div 
                className={classes.spacingStyle}
            />
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getSpacing(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

const useStyles = theme => ({   
    spacingStyle: props => {
        let style = isDesktop(props) ? spacingStyles.SPACING_DESKTOP : spacingStyles.SPACING
        let height = style.height * getSpacing(props).space
        return {
            height
        }
    },
})

export default withStyles(useStyles)(SpacingPreview)