import React from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {setProperty, getProperty, getElement, modifyElement} from './functions'
import Input from './input'
import keys from '../../../../../config/keys'

class BannerDropzone extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            isLoading: false
        }
    }
    
    getElement() {
        const {stage, element, sectionElement} = this.props
        return getElement({
            props: this.props, 
            selectedStage: stage,
            selectedElement: element,
            selectedSectionElement: sectionElement
        })
    }
    
    getProperty(propertyType, property) {
        const {stage, element, sectionElement} = this.props
        return getProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, property, 
            selectedSectionElement: sectionElement
        })
    }
    
    setProperty(propertyType, property, value) {
        const {stage, element, sectionElement} = this.props
        setProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
    }
    
    modifyElement(newElement) {
        const {stage, element, sectionElement} = this.props
        modifyElement({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            element: newElement,
            selectedSectionElement: sectionElement
        })
    }
    
    uploadImage(imageBase64) {
        axios.post(process.env.APP_URL + '/upload-image', {data: imageBase64})
        .then(res => {
            this.setState({isLoading: false})
            this.handleUrlChange(res.data)
        }).catch(err => {
            if (err.response.data) {
                this.props.showToastAction(true, err.response.data, 'error')
            } else {
                this.props.showToastAction(true, `Couldn't upload image. Please try again later.`, 'error')
            }
            this.setState({isLoading: false})
        })   
    }

    async onDrop(acceptedFiles) {
        this.setState({isLoading: true})
        if (acceptedFiles && acceptedFiles.length > 0) {
            let reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onload = () => {
                this.uploadImage(reader.result)
            };
            reader.onerror = (error) => {
                this.setState({isLoading: false})
                this.props.showToastAction("Couldn't upload image. Please try again later", "error")
            };
        }
    }

    handleUrlChange(value) {
        this.setProperty(null, keys.IMAGE_PROPERTY, value)
    }
    
    getUrlValue() {
        return this.getProperty(null, keys.IMAGE_PROPERTY)
    }
    
    getImageUrl() {
        const image = this.getUrlValue()
        if (!image || image.includes('s3.amazonaws.com')) return ''
        return image
    }
    
    createTabElement(element, media, w, h) {
        element.position.width = w
        element.position.height = h
        element.position.aspectRatio = true
        if (media.mediaType == keys.SVG_PROPERTY) {
            element.tabType = keys.SVG_PROPERTY
            element.svg = media.media
        } else {
            element.tabType = keys.IMAGE_PROPERTY
            element.image = media.media
        }
        
        return element
    } 
    
    createButtonElement(element, media, w, h) {
        element.position.width = w
        element.position.height = h
        element.position.aspectRatio = true
        if (media.mediaType == keys.SVG_PROPERTY) {
            element.buttonType = keys.SVG_PROPERTY
            element.svg = media.media
        } else {
            element.buttonType = keys.IMAGE_PROPERTY
            element.image = media.media
        }
        
        return element
    } 
    
    createImageElement(element, media, w, h) {
        element.position.width = w
        element.position.height = h
        element.position.aspectRatio = true
        if (media.mediaType == keys.SVG_PROPERTY) {
            element.imageType = keys.SVG_PROPERTY
            element.svg = media.media
        } else {
            element.imageType = keys.IMAGE_PROPERTY
            element.image = media.media
        }
        return element
    } 

    calculateDefaultDimensions(media, wantedSize) {
        let {width, height} = media
        const widthHeightRatio = width / height
        const defaultHeight = widthHeightRatio * wantedSize
        return {width: wantedSize, height: defaultHeight ? defaultHeight : wantedSize}
    }
    
    toggleLibrary(event) {
        const handleSelectMedia = (media, name) => {
            let element = {}
            let currentElement = this.getElement()
            switch (currentElement.type) {
                case(keys.BUTTON):
                    var buttonImageDimension = this.calculateDefaultDimensions(media, 100)
                    element = this.createButtonElement(currentElement, media, buttonImageDimension.width, buttonImageDimension.height)
                    break;
                case(keys.TAB):
                    var tabImageDimension = this.calculateDefaultDimensions(media, 100)
                    element = this.createTabElement(currentElement, media, tabImageDimension.width, tabImageDimension.height)
                    break;
                case(keys.IMAGE):
                    var {width, height} = this.calculateDefaultDimensions(media, 500)
                    element = this.createImageElement(currentElement, media, width, height)
                    break;
                case(keys.BACKGROUND):
                    element = {...currentElement}
                    element.image = media.media
                    break;
                case(keys.MAINBOARD):
                    element = {...currentElement}
                    element.image = media.media
                    break;
            }
            
            console.log('E ', element)
            this.modifyElement(element)
        }   
        
        let disabledCategories = []
        const currentElement = this.getElement()
        switch (currentElement.type) {
            case(keys.BACKGROUND):
                disabledCategories.push(keys.ILLUSTRATION_CATEGORY)
                break;
            case(keys.MAINBOARD):
                disabledCategories.push(keys.ILLUSTRATION_CATEGORY)
                break;
        }
        
        this.props.setState({templateOptions: [{
            templateType: keys.MEDIA_TEMPLATE,
            onSelect: (media, name) => handleSelectMedia(media, name),
            disabledCategories
        }]})
    }

    render() {
        const {classes} = this.props       
        return (
            <div 
                ref={(container) => { if (container) this.container = container }}>
                <Dropzone 
                    onDrop={files => this.onDrop(files)}
                    noClick={true}
                    noKeyboard={true}
                    accept='image/jpeg, image/png, image/svg+xml'
                >
                    {({getRootProps, getInputProps, open, acceptedFiles}) => {
                        let imageUrl = this.getUrlValue()
                        let buttonText = 'Remove image'
                        let imageSelectorAction = () => this.handleUrlChange('')
                        if (!imageUrl || imageUrl == '') {
                            buttonText = 'Select image'
                            imageSelectorAction = open
                        }
                        return (
                            <div
                                className={classes.mainContainer} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className={classes.dropzoneContainer}>
                                    <p>Drag 'n' drop some files here, or click to select files. (Only .svg, .jpeg/jpg, or .png)</p>
                                </div>
                                <div className={classes.bannerEditButtonsContainer}>
                                    <Button 
                                        onClick={() => this.toggleLibrary()}
                                        size="small"                        
                                        variant="outlined" color="primary"
                                        className={classes.firstButton}     
                                        disabled={this.state.isLoading}                       
                                    >
                                        Photo Library
                                    </Button>
                                    <Button 
                                        onClick={() => imageSelectorAction()}
                                        size="small"                        
                                        variant="outlined" color="primary"
                                        className={classes.secondButton}     
                                        disabled={this.state.isLoading}                       
                                    >
                                        {buttonText}
                                    </Button>
                                </div>
                            </div>
                        )
                    }}
                </Dropzone>
                <Input
                    label='Image or gif url'
                    onChange={this.handleUrlChange.bind(this)}
                    value={this.getImageUrl()}
                />
            </div>
        );
    }
}

const useStyles = theme => ({    
    sizeTextField: {
        margin: '5px', 
        width: '150px'  
    },
    mainContainer: {
        margin: '15px 0px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: '2px',
        borderColor: 'gray',
        borderStyle: 'dashed',
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
    emptyPreviewContainer: {
        margin: theme.spacing(2),
        position: 'relative',
        backgroundColor: 'white'
    },
    resizeButtonsContainer: {
        display: 'flex',
        width: '450px',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: theme.spacing(1)
    },
    previewContainer: {
        position: 'relative',
        margin: theme.spacing(1),
    },
    previewImg: {
        width: '100%',
        height: 'auto',
        zIndex: 1
    },
    bannerEditButtonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2)
    },
    firstButton: {        
        height: '30px',
        fontSize: '13px',    
        marginRight: theme.spacing(2),
        marginBottom: 13
    },
    secondButton: {        
        height: '30px',
        fontSize: '13px',    
        marginRight: theme.spacing(2)
    }
});

export default withStyles(useStyles)(BannerDropzone)