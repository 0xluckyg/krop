import React from 'react'
import QRCode from 'qrcode.react';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import imageStyles from '../../../../shared/campaign-styles/media'
import elementStyle from '../../../../shared/campaign-styles/reusable'

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
            <div className={classes.containerStyle}>
                <div className={classes.qrWrapper}>
                    <QRCode 
                        value={process.env.APP_URL}
                        size={200}
                        fgColor={'#000'}
                        // includeMargin
                    />
                </div>
                <div>
{/* fefwef */}
                </div>
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
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

const useStyles = theme => ({   
    containerStyle: props => {
        let style = isDesktop(props) ? elementStyle.CONTAINER_DESKTOP : elementStyle.CONTAINER

        return {
            ...style 
        }
    },
    qrWrapper: props => {
        const {align} = getStyle(props) 
        console.log("AL: ", align)
        let justifyContent = align == 'left' ? 'flex-start' : align == 'center' ? 'center' : 'flex-end'
        return {
            display: 'flex',
            justifyContent
        }
    },
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