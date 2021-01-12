import React from 'react'
import QRCode from 'qrcode.react';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import imageStyles from '../../../../shared/survey-styles/media'

class LoyaltyPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getLoyalty() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    render() {
        const {classes} = this.props
        
        return (
            <div>
                <QRCode 
                    value={process.env.APP_URL}
                    size={300}
                    fgColor={'#000'}
                    includeMargin
                />
            </div>
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
        let style = isDesktop(props) ? imageStyles.IMAGE_DESKTOP : imageStyles.IMAGE
        let {rounding} = getStyle(props)
        return {
            borderRadius: rounding ? 20 : 0,
            ...style
        }
    },
})

export default withStyles(useStyles)(LoyaltyPreview)