import React from 'react'
import clsx from 'clsx'
import Slider from 'react-input-slider'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import sliderStyle from '../../../../shared/survey-styles/slider'
import elementStyle from '../../../../shared/survey-styles/reusable'

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
                active: {
                    ...style.ACTIVE,
                    backgroundColor: primaryColor
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
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {this.renderSlider()}
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
})

export default withStyles(useStyles)(SliderPreview)