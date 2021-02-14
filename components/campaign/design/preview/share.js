import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import shareStyles from '../../../../shared/campaign-styles/share'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import socialIcons from '../../../../static/campaign/social-icons';

let strings = new LocalizedStrings({
    en:{
        facebookShareLabel: "Share on Facebook!",
        twitterShareLabel: "Share on Twitter!",
        // instagramShareLabel: "Share on Instagram!",
    },
    kr: {
        facebookShareLabel: "페이스북에 공유하기!",
        twitterShareLabel: "트위터에 공유하기!!",
        // instagramShareLabel: "인스타그램에 공유하기!",
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class SharePreview extends React.Component {
    constructor(props) {
        super(props)
    }

    getElement() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderQuestion() {
        const {classes} = this.props
        const share = this.getElement()
        return <p className={classes.titleStyle}>
            {share.question}
        </p>
    }

    renderShareButton(platform) {
        const {classes} = this.props

        const platformText = {
            'facebook': strings.facebookShareLabel,
            // 'instagram': strings.instagramShareLabel,
            'twitter': strings.twitterShareLabel
        }

        const {svg, color} = socialIcons[platform]
        return (
            <button 
                key={platform}
                style={{
                    backgroundColor: color
                }}
                className={classes.shareButtonStyle}
            >
                <div className={classes.shareButtonIconStyle} dangerouslySetInnerHTML={{__html: svg}}/>
                <p className={classes.shareButtonTextStyle}>{platformText[platform]}</p>
            </button>
        )
    }
    

    render() {
        const {classes, state} = this.props
        const element = this.getElement()
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {element.platforms.map(platform => {
                    return this.renderShareButton(platform)
                })}
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
        let style = isDesktop(props) ? shareStyles.SHARE_CONTAINER_DESKTOP : shareStyles.SHARE_CONTAINER
        
        return {
            ...style
        }  
    },
    titleStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? elementStyle.QUESTION_DESKTOP : elementStyle.QUESTION
        let customStyle = isDesktop(props) ? shareStyles.SHARE_TITLE_DESKTOP : shareStyles.SHARE_TITLE
        return {
            ...style,
            ...customStyle,
            fontFamily: font, 
            color: textColor
        }
    },
    shareButtonStyle: props => {
        let style = isDesktop(props) ? shareStyles.SHARE_BUTTON_DESKTOP : shareStyles.SHARE_BUTTON
        const {primaryColor, align} = getStyle(props)
        
        let textAlign = 'center'
        if (align == 'left') {
            textAlign = 'left'
        } else if (align == 'right') {
            textAlign = 'right'
        }
        
        return {
            textAlign,
            ...style,
            '&:focus:': {
                ...style.FOCUS
            },
            '&:active': {
                ...style.ACTIVE
            },
            '&:hover': {
                ...style.HOVER
            }
        }
    },
    shareButtonIconStyle: props => {
        let style = isDesktop(props) ? shareStyles.SHARE_BUTTON_ICON_DESKTOP : shareStyles.SHARE_BUTTON_ICON
        return {
            ...style
        }
    },
    shareButtonTextStyle: props => {
        let style = isDesktop(props) ? shareStyles.SHARE_BUTTON_TEXT_DESKTOP : shareStyles.SHARE_BUTTON_TEXT
        return {
            ...style
        }
    }
})

export default withStyles(useStyles)(SharePreview)