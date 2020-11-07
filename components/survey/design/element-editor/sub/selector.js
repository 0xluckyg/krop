import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class Selector extends React.Component {
    renderOptions(options, value, onChange) {
        return (
            <Select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                inputProps={{
                    name: 'selector',
                    id: 'selector',
                }}
            >
                {options.map((option, i) => {
                    return <MenuItem 
                        key={i} 
                        value={option.value ? option.value : option}>
                            {option.name ? option.name : option}
                        </MenuItem>
                })}
            </Select>
        )
    }
    
    render() {
        const {classes, label, onChange, options, value} = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>{label}</InputLabel>
                {this.renderOptions(options, value, onChange)}
            </FormControl>
        )
    }
}

const useStyles = theme => ({  
    formControl: {
        marginBottom: 18, 
        width: '100%'
    }
})

export default withStyles(useStyles)(Selector)