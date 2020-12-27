import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import keys from '../../../config/keys'

class Device extends React.Component {
    constructor(props){
        super(props)
    }
    
    handleSwitchOption(value) {
        const {state, setState} = this.props
        let newState = {...state}
        
        newState.settings.device = value
        
        setState(newState)
    }

    render() {
        const {classes, state} = this.props  
        return (          
            <Paper className={classes.paper}>     
                <Typography variant="subtitle2" gutterBottom>
                    Device
                </Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="type" name="type" 
                        value={state.settings.device} 
                        onChange={(event) => this.handleSwitchOption(event.target.value)} row>
                        <FormControlLabel value="both" control={<Radio />} label="Both" />
                        <FormControlLabel value={keys.PHONE_ELEMENT} control={<Radio />} label="Mobile Only" />
                        <FormControlLabel value={keys.DESKTOP_PROPERTY} control={<Radio />} label="Desktop Only" />
                    </RadioGroup>
                </FormControl><br/>
            </Paper>    
        )
    }
}

const useStyles = theme => ({    
    paper: {
        padding: theme.spacing(3, 5),
        marginTop: theme.spacing(4)
    },    
    formControl: {
        marginTop: theme.spacing(1),
    },
    datePicker: {
        marginRight: theme.spacing(4),
        width: 195
    },
});

export default withStyles(useStyles)(Device);