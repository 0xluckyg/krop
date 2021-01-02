import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import shareStyles from '../../../../shared/survey-styles/share'
import elementStyle from '../../../../shared/survey-styles/reusable'
import socialIcons from '../../../../static/survey/social-icons';

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
            'facebook': 'Share on Facebook!',
            'instagram': 'Share on Instagram!',
            'twitter': 'Share on Twitter!'
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