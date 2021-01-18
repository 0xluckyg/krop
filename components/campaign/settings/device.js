import React from 'react';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import keys from '../../../config/keys'

let strings = new LocalizedStrings({
    en:{
        deviceLabel: "Device",
        bothLabel: "Both",
        mobileLabel: "Mobile only",
        desktopLabel: "Desktop only"
    },
    kr: {
        deviceLabel: "기기들",
        bothLabel: "모든 기기",
        mobileLabel: "오직 모바일",
        desktopLabel: "오직 데스크탑"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

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
                    {strings.deviceLabel}
                </Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="type" name="type" 
                        value={state.settings.device} 
                        onChange={(event) => this.handleSwitchOption(event.target.value)} row>
                        <FormControlLabel value="both" control={<Radio />} label={strings.bothLabel} />
                        <FormControlLabel value={keys.PHONE_ELEMENT} control={<Radio />} label={strings.mobileLabel} />
                        <FormControlLabel value={keys.DESKTOP_PROPERTY} control={<Radio />} label={strings.desktopLabel} />
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