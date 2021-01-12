import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import videoStyles from '../../../../shared/campaign-styles/media'

class VideoPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getVideo() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    render() {
        const {classes} = this.props
        const {url} = this.getVideo()
        if (url == '' || !url) return null
        return (
            <div className={classes.videoContainerStyle}>
                <iframe width="100%" className={classes.videoStyle} src={url+"?controls=0&autoplay=1"}/>
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
    videoContainerStyle: props => {
        let style = isDesktop(props) ? videoStyles.VIDEO_CONTAINER_DESKTOP : videoStyles.VIDEO_CONTAINER
        return {
            ...style
        }
    },
    videoStyle: props => {
        let style = isDesktop(props) ? videoStyles.VIDEO_DESKTOP : videoStyles.VIDEO
        let {rounding} = getStyle(props)
        return {
            borderRadius: rounding ? 20 : 0,
            ...style
        }
    }
})

export default withStyles(useStyles)(VideoPreview)