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
        const {stage, element, sectionElement} = this.props
        return getProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, property, 
            selectedSectionElement: sectionElement
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {stage, element, sectionElement} = this.props
        modifyProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
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
        const {state, setState, stage, element, getParentDimension, sectionElement} = this.props
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
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}
                    
                    sectionElement={sectionElement}
                />
                <Style
                    disabled={['color']}
                    stage={stage}
                    element={element}
                    state={state}
                    setState={setState}
                    
                    sectionElement={sectionElement}
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