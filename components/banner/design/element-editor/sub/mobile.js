import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';

import SectionContainer from '../frame/section-container'

import {
    handleDisabled, 
    handleLimit, 
    modifyProperty, 
    getProperty, 
    getElement
}  from './functions'
import keys from '../../../../../config/keys'

class MobileConfiguration extends React.Component {
    constructor(props) {
        super(props)
    }

    modifyProperty(value) {
        const {type, property} = this.props
        const {stage, element, sectionElement} = this.props
        modifyProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType: type, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
    }
    
    getProperty() {
        const {type, property} = this.props
        const {stage, element, sectionElement} = this.props
        return getProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType: type, 
            property, 
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

    handleScaleChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        this.modifyProperty(keys.PHONE_ELEMENT, 'scale', value / 100)
    }
    
    renderSliderField(type, property, label, min, max, onChange) {
        const {classes} = this.props
        if (handleDisabled(this.props, property)) return 
        let value = this.getProperty(type, property) * 100

        return (
            <div className={classes.sliderFieldContainer}>
                <div className={classes.textFieldContainer}>
                    <TextField
                        onChange={event => {
                            onChange(event.target.value, min)
                        }}
                        value={value}
                        className={classes.textFieldStyle}
                        label={label}
                    />
                </div>
                <Slider
                    onChange={(event, value) => onChange(value, min, max)}
                    className={classes.slider}
                    value={value}
                    min={min}
                    max={max}
                    step={1}
                />    
            </div>
        )
    }
    
    render() {
        return (
            
            <SectionContainer title="Mobile View">
                {this.renderSliderField(keys.PHONE_ELEMENT, 'scale', 'Size (%)', 0, 300,
                    this.handleScaleChange.bind(this))
                }
            </SectionContainer>
        )
    }
}


const useStyles = theme => ({  
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: '2px', 
        width: '100%'
    },
    textFieldStyle: {
        flex: 1
    },
    sliderFieldContainer: {
        marginBottom: 5  
    },
    slider: {
        width: '100%'
    }
})

export default withStyles(useStyles)(MobileConfiguration)