import React, {Fragment} from 'react'
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
var embed = require("embed-video")

import Position from './sub/position'
import Style from './sub/style'
import Input from './sub/input'
import SectionContainer from './frame/section-container'
import {getProperty, modifyProperty, getElement, modifyElement} from './sub/functions'
import { showToastAction } from '../../../../redux/actions';

class VideoEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getProperty(propertyType, property) {
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, property, 
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
        })
    }
    
    getElement() {
        const {element} = this.props
        return getElement({
            props: this.props, 
            selectedElement: element,
        })
    }
    
    modifyElement(newElement) {
        const {element} = this.props
        modifyElement({
            props: this.props, 
            selectedElement: element, 
            element: newElement
        })
    }
    
    getUrl() {
        return this.getProperty(null, 'url')
    }
    
    getEmbedUrl() {
        return this.getProperty(null, 'embedUrl')
    }
    
    setEmbedUrl(value) {
        this.modifyProperty(null, 'embedUrl', value)
    }
    
    convertEmbedUrl(url) {
        try {
            const iframeString = embed(url)   
            if (!document || !iframeString) return url
            const wrapper= document.createElement('div');
            wrapper.innerHTML= iframeString
            const iframeElement = wrapper.firstChild;
            return iframeElement.src
        } catch (err) {
            this.props.showToastAction(true, 'Please enter a valid url', 'error')
            return ''
        }
    }
    
    handleLinkChange(link) {
        const embedLink = this.convertEmbedUrl(link)
        const element = this.getElement()
        let newElement = JSON.parse(JSON.stringify(element))
        newElement.url = link
        newElement.embl = embedLink
        this.modifyElement(newElement)
    }
    
    render() {
        const {state, setState, element, getParentDimension} = this.props
        return (
            <Fragment>
                <SectionContainer title="Video url">
                    <Input
                        label='Url (Link)'
                        onChange={this.handleLinkChange.bind(this)}
                        value={this.getUrl()}
                    />
                </SectionContainer>
                <Position
                    device={state.viewMode}
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}
                />
                <Style
                    disabled={['color']}
                    element={element}
                    state={state}
                    setState={setState}
                />
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(VideoEditor));