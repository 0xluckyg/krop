import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

class ShowAfter extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            
        }
    }
    
    handleLimit(value, min, max) {
        if (isNaN(value)) return false
        if (value < min || value > max) return false
        return true
    }
    
    handleDayChange(d) {
        const bool = this.handleLimit(d, 0, 99999)
        if (bool) this.props.onChange("d", Number(d))
    }
    
    handleHourChange(h) {
        const bool = this.handleLimit(h, 0, 23)
        if (bool) this.props.onChange("h", Number(h))
    }
    
    handleMinuteChange(m) {
        const bool = this.handleLimit(m, 0, 59)
        if (bool) this.props.onChange("m", Number(m))
    }
    
    handleSecondChange(s) {
        const bool = this.handleLimit(s, 0, 59)
        if (bool) this.props.onChange("s", Number(s))
    }

    render() {
        const {classes, duration} = this.props  
        return (          
            <div>
                <TextField       
                    className={classes.formControl}
                    label="Days"
                    style={{marginBottom: '2px'}}
                    value={duration.d}
                    onChange={(event) => this.handleDayChange(event.target.value)}
                />
                <TextField                                            
                    className={classes.formControl}
                    label="Hours"
                    style={{marginBottom: '2px'}}
                    value={duration.h}
                    onChange={(event) => this.handleHourChange(event.target.value)}
                    helperText="0 - 23"
                />
                <TextField                   
                    className={classes.formControl}
                    label="Minutes"
                    style={{marginBottom: '2px'}}
                    value={duration.m}
                    onChange={(event) => this.handleMinuteChange(event.target.value)}
                    helperText="0 - 59"
                />
                <TextField
                    className={classes.formControl}
                    label="Seconds"
                    style={{marginBottom: '2px'}}
                    value={duration.s}
                    onChange={(event) => this.handleSecondChange(event.target.value)}
                    helperText="0 - 59"
                />
            </div>
        )
    }
}

const useStyles = theme => ({    
    formControl: {
        marginRight: theme.spacing(4),
        width: 80
    },
});

export default withStyles(useStyles)(ShowAfter);