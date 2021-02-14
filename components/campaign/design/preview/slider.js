import React from 'react'
import LocalizedStrings from 'react-localization';
import Slider from 'react-input-slider'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import sliderStyle from '../../../../shared/campaign-styles/slider'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import alertStyle from '../../../../shared/campaign-styles/alert'

let strings = new LocalizedStrings({
    en:{
        alertLabel: "* Please move the slider"
    },
    kr: {
        alertLabel: "* 슬라이더를 움직여 주세요"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class SliderPreview extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            sliderValue: 0
        }
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    renderQuestion() {
        const {classes} = this.props
        const slider = this.getElement()
        return <p className={classes.questionStyle}>
            {slider.question}
        </p>
    }
    
    isDesktop() {
        let {viewMode} = this.props.state
        return viewMode == keys.DESKTOP_PROPERTY
    }
    
    getStyle() {
        let {stage} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
    }
    
    renderSlider() {
        const {primaryColor, textColor} = this.getStyle()
        const slider = this.getElement()
        let style = this.isDesktop() ? sliderStyle.SLIDER_DESKTOP : sliderStyle.SLIDER
        return <Slider
            axis="x"
            styles={{
                track: {
                    ...style.TRACK,
                    backgroundColor: textColor
                },
                thumb: {
                    ...style.THUMB,
                    backgroundColor: primaryColor
                }
            }}
            xstep={1}
            xmin={slider.min}
            xmax={slider.max}
            onChange={value => {
                this.setState({sliderValue: value.x})
            }}
            x={this.state.sliderValue}
        />
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>{strings.alertLabel}</p>
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {this.renderSlider()}
                {this.renderAlert()}
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

function getAlert(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.ALERT_SETTINGS})
}

const useStyles = theme => ({
    containerStyle: props => {
        let style = isDesktop(props) ? elementStyle.CONTAINER_DESKTOP : elementStyle.CONTAINER
        return {
            ...style
        }
    },
    questionStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? elementStyle.QUESTION_DESKTOP : elementStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
        }
    },
    alertStyle: props => {
        const {textColor} = getAlert(props)
        const {font, primaryColor} = getStyle(props)
        let style = isDesktop(props) ? alertStyle.ALERT_TEXT_DESKTOP : alertStyle.ALERT_TEXT
        return {
            ...style,
            font: font,
            color: textColor
        }
    }
})

export default withStyles(useStyles)(SliderPreview)