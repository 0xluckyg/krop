import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';
import VideoIcon from '@material-ui/icons/YouTube';

import Draggable  from './sub/draggable-element'
import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class VideoPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {element} = this.props
        return getElement({props: this.props, selectedElement: element})
    }
    
    getVideoEmptyView() {
        const {classes} = this.props
        return (
            <div className={clsx(classes.mainContainer, classes.videoStyle)}>
                <div className={classes.dropzoneContainer}>
                    <VideoIcon fontSize="large"/>
                    <p className={classes.emptyVideoText}>
                        "No video to show. Please enter a valid video url or an embed url."
                    </p>
                </div>
            </div>
        )
    }
    
    render() {
        const {zIndex, state, setState, element, setCenterRuler, getParentDimension, sectionElement, rndScale} = this.props
        const {embedUrl} = this.getElement()
        let iframe
        if (embedUrl == '' || !embedUrl) {
            iframe = this.getVideoEmptyView()
        } else {
            iframe = <iframe className={classes.videoStyle} src={embedUrl+"?controls=0&autoplay=1"}/>
        }
        return (
            <Draggable
                state={state}
                setState={setState}
                element={element}
                sectionElement={sectionElement}
                zIndex={zIndex}
                setCenterRuler={setCenterRuler}
                getParentDimension={getParentDimension}
                rndScale={rndScale}
            >
                {iframe}
            </Draggable>
        )
    }
}

//MAKE RESPONSIVE ON MOBILE USING META VIEWPORT, SCALE ACCORDING TO SCREEN SIZE, POSITION CHANGE
//ALSO CREATE MOBILE ONLY OPTION

function getElementFromProps(props) {
    let {element} = props
    return getElement({props, selectedElement: element})
}

function getVideoStyle(props) {
    const video = getElementFromProps(props)
    const {cornerRounding, borderColor, borderWidth, opacity, shadow, padding, shadowColor} = video.style
    const {rotate, scale} = video.position
    
    return {
        height: '100%',
        width: '100%',
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        borderColor,
        opacity,
        transform: `scale(${scale ? scale : 1}) rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`
    }
}

const useStyles = theme => ({
    videoStyle: props => ({...getVideoStyle(props)}),
    
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    },
    dropzoneContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    emptyVideoText: {
        textAlign: 'center',
        fontSize: 16,
        paddingLeft: 20,
        paddingRight: 20
    }
})

export default withStyles(useStyles)(VideoPreview)