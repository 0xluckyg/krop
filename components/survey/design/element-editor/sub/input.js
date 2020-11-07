import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

class Input extends React.Component {
    render() {
        const {classes, label, onChange, value, error, helperText} = this.props
        return (
            <div className={classes.inputFieldContainer}>
                <TextField   
                    error={error}
                    helperText={helperText}
                    onChange={event => onChange(event.target.value)}
                    value={value}
                    className={classes.textFieldStyle}
                    label={label}
                    
                />
            </div>
        )
    }
}

const useStyles = theme => ({  
    inputFieldContainer: {
        marginBottom: 5  
    },
    textFieldStyle: {
        marginBottom: '2px', 
        width: '100%'
    }
})

export default withStyles(useStyles)(Input)