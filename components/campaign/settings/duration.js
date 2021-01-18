import React from 'react';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
    MuiPickersUtilsProvider,    
    KeyboardDatePicker,
} from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';

let strings = new LocalizedStrings({
    en:{
        monthLabel: "Month",
        dayLabel: "Day",
        fromLabel: "From",
        dateError: "'From' date cannot be greater than the 'To' date",
        showDurationLabel: "Campaign duration",
        alwaysLabel: "Always",
        annualLabel: "Annual",
        scheduledLabel: "Scheduled"
    },
    kr: {
        monthLabel: "월",
        dayLabel: "일",
        fromLabel: "부터",
        dateError: "끝나는 날짜는 시작하는 날짜보다 전 일수 없어요!",
        showDurationLabel: "캠페인 기간",
        alwaysLabel: "항상",
        annualLabel: "매년",
        scheduledLabel: "일시적"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class ShowAfter extends React.Component {
    constructor(props){
        super(props)
    }
    
    handleSwitchOption(value) {
        const {state, setState} = this.props
        let newState = {...state}
        
        newState.settings.schedule.type = value
        newState.settings.schedule.from = 101
        newState.settings.schedule.to = 1231
        newState.settings.schedule.fromOverflow = 101
        newState.settings.schedule.toOverflow = 1231
        
        const fromYear = value == 'schedule' ? new Date().getFullYear() : 0
        const toYear = value == 'schedule' ? new Date().getFullYear() : 3000
        newState.settings.schedule.fromYear = fromYear
        newState.settings.schedule.toYear = toYear
        
        setState(newState)
    }
    
    handleDateMax(value, type) {
        if (type == 'month') {
            return (value >= 1 && value <= 12)
        } else {
            return (value >= 1 && value <= 31)
        }
    }
    
        
    parseFromDuration() {
        const duration = this.props.state.settings.schedule
        let date = new Date()
        date.setFullYear(duration.fromYear)
        let from = duration.from.toString()
        date.setMonth(from.slice(0, -2)-1)
        date.setDate(from.slice(-2))
        
        return date
    }
    
    parseToDuration() {
        const duration = this.props.state.settings.schedule
        let date = new Date()
        date.setFullYear(duration.toYear)
        let to = duration.toOverflow.toString()
        date.setMonth(to.slice(0, -2)-1)
        date.setDate(to.slice(-2))
        
        return date
    }
    
    handleMonthDurationChange(value, type) {
        if (!this.handleDateMax(value, 'month')) return
        const {state, setState} = this.props
        const duration = state.settings.schedule
        let newState = {...JSON.parse(JSON.stringify(state))}
        
        if (type == 'from') {
            let from = duration.from.toString()
            let newDate = '' + value + from.slice(-2)
            newDate = Number(newDate)
            newState.settings.schedule.from = newDate
            
            if (newDate > newState.settings.schedule.toOverflow) {
                newState.settings.schedule.to = 1231
                newState.settings.schedule.fromOverflow = 101
            } else {
                newState.settings.schedule.fromOverflow = newDate
            }
        } else {
            let to = duration.toOverflow.toString()
            let newDate = '' + value + to.slice(-2)
            newDate = Number(newDate)
            newState.settings.schedule.toOverflow = newDate
            
            if (newDate < newState.settings.schedule.from) {
                newState.settings.schedule.to = 1231
                newState.settings.schedule.fromOverflow = 101
            } else {
                newState.settings.schedule.to = newDate
            }
        }
        
        setState(newState)
    }
    
    handleDayDurationChange(value, type) {
        if (!this.handleDateMax(value, 'day')) return
        const {state, setState} = this.props
        const duration = state.settings.schedule
        let newState = {...JSON.parse(JSON.stringify(state))}
        const day = value < 10 ? '0' + value : value
        
        if (type == 'from') {
            let from = duration.from.toString()
            let newDate = '' + from.slice(0, -2) + day 
            newDate = Number(newDate)
            
            newState.settings.schedule.from = newDate
            
            if (newDate > newState.settings.schedule.toOverflow) {
                newState.settings.schedule.to = 1231
                newState.settings.schedule.fromOverflow = 101
            } else {
                newState.settings.schedule.fromOverflow = newDate
            }
        } else {
            let to = duration.toOverflow.toString()
            let newDate = '' + to.slice(0, -2) + day
            newDate = Number(newDate)
            
            newState.settings.schedule.toOverflow = newDate
            
            if (newDate < newState.settings.schedule.from) {
                newState.settings.schedule.to = 1231
                newState.settings.schedule.fromOverflow = 101
            } else {
                newState.settings.schedule.to = newDate
            }
        }
        setState(newState)
    }
    
    renderDurationPicker() {
        const {classes, state} = this.props
        
        if (state.settings.schedule.type != 'repeat') return null
        const schedule = state.settings.schedule
        let from = schedule.from.toString()
        let fromMonth = Number(from.slice(0,-2))
        let fromDay = Number(from.slice(-2))
        
        let to = schedule.toOverflow.toString()
        let toMonth = Number(to.slice(0,-2))
        let toDay = Number(to.slice(-2))
        
        return (          
            <div>
                <TextField       
                    type="number"
                    className={classes.durationForm}
                    label={strings.monthLabel}
                    style={{marginBottom: '2px'}}
                    value={fromMonth}
                    onChange={(event) => this.handleMonthDurationChange(event.target.value, 'from')}
                    helperText="1 - 12"
                />
                <TextField                                            
                    type="number"
                    className={classes.durationForm}
                    label={strings.dayLabel}
                    style={{marginBottom: '2px'}}
                    value={fromDay}
                    onChange={(event) => this.handleDayDurationChange(event.target.value, 'from')}
                    helperText="1 - 31"
                />
                <TextField       
                    type="number"
                    className={classes.durationForm}
                    label={strings.monthLabel}
                    style={{marginBottom: '2px'}}
                    value={toMonth}
                    onChange={(event) => this.handleMonthDurationChange(event.target.value, 'to')}
                    helperText="1 - 12"
                />
                <TextField             
                    type="number"
                    className={classes.durationForm}
                    label={strings.dayLabel}
                    style={{marginBottom: '2px'}}
                    value={toDay}
                    onChange={(event) => this.handleDayDurationChange(event.target.value, 'to')}
                    helperText="1 - 31"
                />
            </div>
        )
    }
    
    renderDatePicker() {
        const {classes, state, setState} = this.props
        
        if (state.settings.schedule.type != 'schedule') return null
        
        return (
             <MuiPickersUtilsProvider utils={MomentUtils}>                        
                    <Grid container>
                        <KeyboardDatePicker
                            onYearChange={() => {}}
                            className={classes.datePicker}
                            margin="normal"
                            label={strings.fromLabel}
                            value={this.parseFromDuration()}
                            onChange={date => {                                    
                                const newDate = new Date(date._d)
                                const newState = {...JSON.parse(JSON.stringify(state))}
                                
                                const dayString = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
                                const fromDate = Number(`${newDate.getMonth() + 1}${dayString}`)
                                newState.settings.schedule.fromYear = newDate.getFullYear()
                                
                                newState.settings.schedule.from = fromDate
                                if (fromDate > newState.settings.schedule.toOverflow) {
                                    newState.settings.schedule.to = 1231
                                    newState.settings.schedule.fromOverflow = 101
                                } else {
                                    newState.settings.schedule.fromOverflow = fromDate
                                }
                                
                                setState(newState)
                            }}
                        />
                        <KeyboardDatePicker
                            className={classes.datePicker}
                            margin="normal"
                            label={strings.toLabel}
                            value={this.parseToDuration()}
                            onChange={date => {
                                const fromDate = new Date(state.from)
                                const newDate = new Date(date._d)     

                                if (fromDate > newDate.getTime()) {
                                    return this.props.showToastAction(true, strings.dateError, 'error')
                                }
                                
                                const newState = {...JSON.parse(JSON.stringify(state))}
                                
                                const dayString = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
                                const toDate = Number(`${newDate.getMonth() + 1}${dayString}`)
                                newState.settings.schedule.toYear = newDate.getFullYear()
                                
                                newState.settings.schedule.toOverflow = toDate
                                if (toDate < newState.settings.schedule.from) {
                                    newState.settings.schedule.to = 1231
                                    newState.settings.schedule.fromOverflow = 101
                                } else {
                                    newState.settings.schedule.to = toDate
                                }
                                
                                setState(newState)
                                
                            }}
                        />                
                    </Grid>                                    
                </MuiPickersUtilsProvider>
        )
    }

    render() {
        const {classes, state} = this.props  
        return (          
            <Paper className={classes.paper}>     
                <Typography variant="subtitle2" gutterBottom>
                    {strings.showDurationLabel}
                </Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                    <RadioGroup aria-label="type" name="type" 
                        value={state.settings.schedule.type} 
                        onChange={(event) => this.handleSwitchOption(event.target.value)} row>
                        <FormControlLabel value="always" control={<Radio />} label={strings.alwaysLabel} />
                        <FormControlLabel value="repeat" control={<Radio />} label={strings.annualLabel} />
                        <FormControlLabel value="schedule" control={<Radio />} label={strings.scheduledLabel} />
                    </RadioGroup>
                </FormControl><br/>
                {this.renderDatePicker()}
                {this.renderDurationPicker()}
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
    durationForm: {
        marginRight: theme.spacing(4),
        width: 80
    },
    datePicker: {
        marginRight: theme.spacing(4),
        width: 195
    },
});

export default withStyles(useStyles)(ShowAfter);