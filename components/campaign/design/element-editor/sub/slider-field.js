import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';

class SliderField extends React.Component {
    
    handleLeave(event) {
        let value = event.target.value
        if (isNaN(event.target.value) || /^ *$/.test(value)) {
            event.target.value = 0
            this.props.textChange(event)
            return
        } else {
            event.target.value = Math.round(value * 10) / 10
            this.props.textChange(event)
        }
    }
    
    cleanValue(value) {
        if (isNaN(value)) return 0
        return Math.round(value * 10) / 10
    }
    
    handleChange(event) {
        const {textChange} = this.props
        
        if (event.target.value == '-') {
            event.target.value = -1
        }
        textChange(event)
    }
    
    render() {
        const {classes, icons, sliderChange, label, value, min, max, step} = this.props
        return (
            <div className={classes.sliderFieldContainer}>
                <div className={classes.textFieldContainer}>
                    <TextField   
                        onChange={(event) => this.handleChange(event)}
                        onBlur={this.handleLeave.bind(this)}
                        value={this.cleanValue(value)}
                        className={classes.textFieldStyle}
                        label={label}
                    />
                    {icons}
                </div>
                <Slider
                    onChange={sliderChange}
                    className={classes.slider}
                    value={Number(value)}
                    min={Number(min)}
                    max={Number(max)}
                    step={step ? Number(step) : 1}
                />    
                
            </div>
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
    iconContainer: {
         marginLeft: 3
    },
    iconButton: {
        height: 30,
        width: 30
    },
    sliderFieldContainer: {
        marginBottom: 5  
    },
    slider: {
        width: '100%'
    }
})

export default withStyles(useStyles)(SliderField)