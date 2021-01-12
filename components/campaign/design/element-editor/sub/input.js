import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

class Input extends React.Component {
    constructor(props) {
        super(props)
    }
    
    
    render() {
        const {classes, label, onChange, value, error, helperText, numOnly} = this.props
        return (
            <div className={classes.inputFieldContainer}>
                <TextField   
                    type={numOnly ? 'number' : ''}
                    id={label}
                    error={error}
                    helperText={helperText}
                    onChange={event => {
                        if (numOnly) {
                            if (isNaN(event.target.value)) return
                        }
                        onChange(event.target.value)
                    }}
                    value={value}
                    className={classes.textFieldStyle}
                    label={label}
                    numOnly={numOnly ? numOnly : false}
                />
            </div>
        )
    }
}

const useStyles = theme => ({  
    inputFieldContainer: {
        marginBottom: 20
    },
    textFieldStyle: {
        marginBottom: '2px', 
        width: '100%'
    }
})

export default withStyles(useStyles)(Input)