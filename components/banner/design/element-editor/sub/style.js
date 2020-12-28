import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { 
    mdiPanTopLeft, 
    mdiPanTopRight, 
    mdiPanBottomLeft, 
    mdiPanBottomRight, 
    mdiPan,
    mdiPanHorizontal, 
    mdiPanVertical, 
    mdiBlur,
    mdiResize
} from '@mdi/js';

import ColorPicker from '../../../../reusable/color-picker'
import SliderField from './slider-field'
import SectionContainer from '../frame/section-container'
import {handleDisabled, handleLimit, modifyProperty, getProperty} from './functions'
import keys from '../../../../../config/keys'

class Style extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCorner: null,
            selectedBorder: null,
            selectedPadding: null,
            selectedMargin: null,
            selectedShadow: 0,
        }
    }
    
    getProperty(propertyType, property) {
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, property
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, 
            property, 
            value
        })
    }
    
    handleColorChange(value) {
        this.modifyProperty('style', 'color', value)
    }
    
    handleOpacityChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        this.modifyProperty('style', 'opacity', value)
    }
    
    handleCornerRoundingChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        const {selectedCorner} = this.state
        let newCornerRounding = [value, value, value, value]
        if (selectedCorner != null) {
            let cornerRounding = this.getProperty('style', 'cornerRounding')
            newCornerRounding = [...cornerRounding]
            newCornerRounding[selectedCorner] = value
        }
        this.modifyProperty('style', 'cornerRounding', newCornerRounding)
    }
    
    handleBorderColorChange(value) {
        this.modifyProperty('style', 'borderColor', value)
    }
    
    handleShadowColorChange(value) {
        this.modifyProperty('style', 'shadowColor', value)
    }
    
    handleBorderWidthChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        const {selectedBorder} = this.state
        let newBorderWidth = [value, value, value, value]
        if (selectedBorder != null) {
            let borderWidth = this.getProperty('style', 'borderWidth')
            newBorderWidth = [...borderWidth]
            newBorderWidth[selectedBorder] = value
        }
        this.modifyProperty('style', 'borderWidth', newBorderWidth)
    }
    
    handlePaddingChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        const {selectedPadding} = this.state
        let newPadding = [value, value, value, value]
        if (selectedPadding != null) {
            let padding = this.getProperty('style', 'padding')
            newPadding = [...padding]
            newPadding[selectedPadding] = value
        }
        this.modifyProperty('style', 'padding', newPadding)
    }
    
    handleMarginChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        const {selectedMargin} = this.state
        let newMargin = [value, value, value, value]
        if (selectedMargin != null) {
            let padding = this.getProperty('style', 'margin')
            newMargin = [...padding]
            newMargin[selectedMargin] = value
        }
        this.modifyProperty('style', 'margin', newMargin)
    }
    
    handleShadowChange(value, min, max) {
        const bool = handleLimit(value, min, max)
        if (!bool) return
        const {selectedShadow} = this.state
        let shadow = this.getProperty('style', 'shadow')
        let newShadow = [...shadow]
        newShadow[selectedShadow] = value
        this.modifyProperty('style', 'shadow', newShadow)
    }

    renderSidePicker(onClick, selected, iconRotation) {
        const {classes} = this.props
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(null)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPan}
                        size={0.9}
                        color={selected == null ? selectedColor : notSelectedColor}
                        rotate={iconRotation + 45}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(0)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanTopLeft}
                        size={0.9}
                        color={selected == 0 ? selectedColor : notSelectedColor}
                        rotate={iconRotation}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(1)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanTopRight}
                        size={0.9}
                        color={selected == 1 ? selectedColor : notSelectedColor}
                        rotate={iconRotation}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(2)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanBottomRight}
                        size={0.9}
                        color={selected == 2 ? selectedColor : notSelectedColor}
                        rotate={iconRotation}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(3)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanBottomLeft}
                        size={0.9}
                        color={selected == 3 ? selectedColor : notSelectedColor}
                        rotate={iconRotation}
                    />
                </IconButton >
            </div>
        )
    }
    
    renderShadowPicker(onClick, selected, iconRotation) {
        const {classes} = this.props
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        return (
            <div className={classes.iconContainer}>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(0)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanHorizontal}
                        size={0.9}
                        color={selected == 0 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(1)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiPanVertical}
                        size={0.9}
                        color={selected == 1 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(2)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiBlur}
                        size={0.9}
                        color={selected == 2 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => onClick(3)}
                    size="small" variant="contained" color="primary">
                    <Icon path={mdiResize}
                        size={0.9}
                        color={selected == 3 ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
    
    renderSliderField(type, property, label, min, max, onChange) {
        const {selectedCorner, selectedBorder, selectedPadding, selectedShadow, selectedMargin} = this.state
        
        if (handleDisabled(this.props, property)) return
        let value = this.getProperty(type, property)
        if (value != 0 && !value) return
        
        let sliderStep = 1
        let typeSelector;
        switch(property) {
            case('cornerRounding'):
                value = value[selectedCorner ? selectedCorner : 0]
                typeSelector = this.renderSidePicker((n) => this.setState({selectedCorner: n}), selectedCorner, 0)
                break;
            case('borderWidth'):
                value = value[selectedBorder ? selectedBorder : 0]
                typeSelector = this.renderSidePicker((n) => this.setState({selectedBorder: n}), selectedBorder, 45)
                break;
            case('padding'):
                value = value[selectedPadding ? selectedPadding : 0]
                typeSelector = this.renderSidePicker((n) => this.setState({selectedPadding: n}), selectedPadding, 45)
                break;
            case('margin'):
                value = value[selectedMargin ? selectedMargin : 0]
                typeSelector = this.renderSidePicker((n) => this.setState({selectedMargin: n}), selectedMargin, 45)
                break;
            case('shadow'):
                switch (selectedShadow) {
                    case(2):
                        min = 0; max = 100       
                        break;
                }
                value = value[selectedShadow]
                typeSelector = this.renderShadowPicker((n) => this.setState({selectedShadow: n}), selectedShadow)
                break;
            case('opacity'):
                sliderStep = 0.01
                break;
            default:
                break;
        }

        return (
            <SliderField
                textChange={event => onChange(event.target.value, min)}
                sliderChange={(event, value) => onChange(value, min, max)}
                value={value}
                label={label}
                min={min}
                max={max}
                step={sliderStep}
                icons={typeSelector}
            />
        )
    }
    
    renderColorPicker(type, property, label, onChange) {
        const {classes} = this.props
        
        if (handleDisabled(this.props, property)) return
        const value = this.getProperty(type, property)
        if (!value) return
        
        return (
            <div className={classes.colorPickerWrapper}>
                <ColorPicker 
                    text={label}
                    color={value} 
                    onChange={onChange}
                />
            </div>
        )
    }
    
    render() {
        return (
            <SectionContainer title="Style">
                {this.renderColorPicker('style', 'color', 'Color', this.handleColorChange.bind(this))}
                {this.renderColorPicker('style', 'borderColor', 'Border Color', this.handleBorderColorChange.bind(this))}
                {this.renderColorPicker('style', 'shadowColor', 'Shadow Color', this.handleShadowColorChange.bind(this))}
                {this.renderSliderField('style', 'opacity', 'Transparency', 0, 1, this.handleOpacityChange.bind(this))}
                {this.renderSliderField('style', 'borderWidth', 'Border Width', 0, 200, this.handleBorderWidthChange.bind(this))}
                {this.renderSliderField('style', 'cornerRounding', 'Corner Rounding', 0, 200, this.handleCornerRoundingChange.bind(this))}
                {this.renderSliderField('style', 'padding', 'Padding', 0, 200, this.handlePaddingChange.bind(this))}
                {this.renderSliderField('style', 'margin', 'Margin', 0, 200, this.handleMarginChange.bind(this))}
                {this.renderSliderField('style', 'shadow', 'Shadow', -10, 50, this.handleShadowChange.bind(this))}
            </SectionContainer>
        )
    }
}


const useStyles = theme => ({  
    colorPickerWrapper: {
        marginBottom: 13
    },
    iconContainer: {
         marginLeft: 3
    },
    iconButton: {
        height: 30,
        width: 30
    }
})

export default withStyles(useStyles)(Style)