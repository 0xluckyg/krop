import React, {Fragment} from 'react'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
var embed = require("embed-video")
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import {setProperty, getProperty} from './sub/functions'
import { showToastAction } from '../../../../redux/actions';

let strings = new LocalizedStrings({
    en:{
        urlError: "Please enter a valid url",
        videoUrlLabel: "Video url",
        videoLinkLabel: "Video url (Link)",
        displaySettingsLabel: "Display settings",
        cornerRoundingLabel: "Corner rounding"
    },
    kr: {
        urlError: "올바른 Url 을 입력해 주세요",
        videoUrlLabel: "비디오 Url",
        videoLinkLabel: "비디오 Url (링크)",
        displaySettingsLabel: "디스프레이 설정",
        cornerRoundingLabel: "모서리 각"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

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
            this.props.showToastAction(true, strings.urlError, 'error')
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
                <SectionContainer title={strings.videoUrlLabel}>
                <Input
                    error={this.state.urlError}
                    label={strings.videoLinkLabel}
                    onChange={value => {
                        this.handleLinkChange(value)
                    }}
                    value={this.getProperty(null, 'url')}
                />
                </SectionContainer>
                <SectionContainer title={strings.displaySettingsLabel}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.cornerRoundingLabel}
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