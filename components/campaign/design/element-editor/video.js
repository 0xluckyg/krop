import React, {Fragment} from 'react'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
var embed = require("embed-video")

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import {setProperty, getProperty} from './sub/functions'
import { showToastAction } from '../../../../redux/actions';

class VideoEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            urlError: ''
        }
    }
    
    getProperty(propertyType, property) {
        const {selectedStage, selectedElement} = this.props.state
        return getProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property
        })
    }
    
    setProperty(propertyType, property, value) {
        const {selectedStage, selectedElement} = this.props.state
        setProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property,
            value
        })
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
        }
    }
    
    handleLinkChange(link) {
        const embedLink = this.convertEmbedUrl(link)
        this.setProperty(null, 'url', embedLink)
    }
    
    render() {
        const {state, setState, stage, element} = this.props
        return (
            <Fragment>
                <SectionContainer title="Video url">
                <Input
                    error={this.state.urlError}
                    label='Video url (Link)'
                    onChange={value => {
                        this.handleLinkChange(value)
                    }}
                    value={this.getProperty(null, 'url')}
                />
                </SectionContainer>
                <SectionContainer title="Display settings">
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title="Corner rounding"
                        property="rounding"
                    />
                </SectionContainer>
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    textTitle: {
        margin: 0,
        fontSize: 10,
        color: keys.APP_COLOR_GRAY_DARK
    },
    inputStyle: {
        border: 'none',
        background: 'transparent',
        fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        resize: 'none',
        fontSize: 15,
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text',
        '&:focus': {
            outline: 'none'
        }
    }
})


function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(VideoEditor));