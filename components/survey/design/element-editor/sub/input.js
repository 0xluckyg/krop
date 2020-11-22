import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
const shortid = require('shortid')

class Input extends React.Component {
    constructor(props) {
        super(props)
    }
    
    
    render() {
        const {classes, label, onChange, value, error, helperText} = this.props
        return (
            <div className={classes.inputFieldContainer}>
                <TextField   
                    id={label}
                    error={error}
                    helperText={helperText}
                    onChange={event => {
                        onChange(event.target.value)
                    }}
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