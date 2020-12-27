import React from 'react'
import clsx from 'clsx'

import ImageIcon from '@material-ui/icons/Image';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import { withStyles } from '@material-ui/core/styles';

import Draggable  from './sub/draggable-element'
import {getElement, modifyElement, modifyProperty} from '../element-editor/sub/functions'

import keys from '../../../../config/keys'

class ImagePreview extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.state={
            imageError: false
        }
    }
    
    getElement() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }
    
    handlePropertyChange(propertyType, property, value) {
        const {selectedStage, selectedElement} = this.props.state
        modifyProperty({
            props: this.props, selectedStage, selectedElement, propertyType, property, value
        })
    }
    
    handleElementChange(element) {
        const {selectedStage, selectedElement} = this.props.state
        modifyElement({
            props: this.props, selectedStage, selectedElement, element
        })
    }
    
    imageWhitelist(url) {
        const fromTemplateWhitelist = ['pexels.com']
        let flag
        fromTemplateWhitelist.map(w => {
            if (url.includes(w)) flag = true
        })
        return flag
    }
    
    resetSizeOnLoad(img) {
        let element = this.getElement()
        if (!element.empty) return
        if (this.imageWhitelist(element.image)) return
        element.position.width = img.naturalWidth
        element.position.height = img.naturalHeight
        element.position.aspectRatio = Math.round((img.naturalWidth / img.naturalHeight) * 10) / 10
        element.empty = false
        // this.handleElementChange(element)
    }
    
    handleImageLoad({target:img}) {
        this.resetSizeOnLoad(img)
        this.setState({imageError: false})
    }
    
    getImageEmptyView(image) {
        const {classes} = this.props
        const {imageError} = this.state
        const invalidImage = (imageError && image.image != '')
        const text = (invalidImage) ?
        "Invalid image. Please use another image." :
        "Empty image. Use the side editor to upload an image."
        const Icon = (invalidImage) ? <BrokenImageIcon fontSize="large"/> : <ImageIcon fontSize="large"/>
        return (
            <div className={clsx(classes.mainContainer, classes.imageStyle)}>
                <div className={classes.dropzoneContainer}>
                    {Icon}
                    <p className={classes.emptyImageText}>{text}</p>
                </div>
            </div>
        )
    }
    
    renderContent() {
        const image = this.getElement()
        const hideImage = (
            (image.imageType == keys.IMAGE_PROPERTY && (image.image == '' || this.state.imageError)) ||
            (image.imageType == keys.SVG_PROPERTY && (image.svg == '' || !image.svg))
        )
        if (hideImage && !image.empty) {
            this.handlePropertyChange(null, 'empty', true)
        }
        if (hideImage) {
            return this.getImageEmptyView(image)
        }
        
        if (image.imageType == keys.SVG_PROPERTY) {
            return (
                <svg
                    style={{display: (hideImage) ? 'none' : ''}}
                    className={this.getStyle()}
                    dangerouslySetInnerHTML={{__html: image.svg}}></svg>
            )
        } else {
            return (
                <img 
                    onError={() => this.setState({imageError: true})}
                    onLoad={this.handleImageLoad.bind(this)}
                    draggable={false} 
                    src={image.image} 
                    style={{display: (hideImage) ? 'none' : ''}}
                    className={classes.imageStyle}
                /> 
            )   
        }
    }
    
    render() {
        const {zIndex, state, setState, stage, element, setCenterRuler, getParentDimension, sectionElement, rndScale} = this.props
        return (
            <Draggable
                state={state}
                setState={setState}
                stage={stage}
                element={element}
                sectionElement={sectionElement}
                zIndex={zIndex}
                setCenterRuler={setCenterRuler}
                getParentDimension={getParentDimension}
                rndScale={rndScale}
            >
                {this.renderContent()}
            </Draggable>
        )
    }
}

function getElementFromProps(props) {
    let {stage, element, sectionElement} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

function getImageStyle(props) {
    const image = getElementFromProps(props)
    const {cornerRounding, borderColor, borderWidth, opacity, shadow, shadowColor} = image.style
    const {rotate, scale} = image.position
    
    return {
        height: '100%',
        width: '100%',
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        borderColor,
        opacity,
        transform: `scale(${scale ? scale : 1}) rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
    }
}


const useStyles = theme => ({    
    imageStyle: props => ({...getImageStyle(props)}),
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
    emptyImageText: {
        textAlign: 'center',
        fontSize: 16,
        paddingLeft: 20,
        paddingRight: 20
    }
});

export default withStyles(useStyles)(ImagePreview)