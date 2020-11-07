import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { showToastAction, isLoadingAction } from '../../../redux/actions';
import PageHeader from '../../../components/reusable/page-header';
import Device from './device'
import Duration from './duration'
import keys from '../../../config/keys'

class SettingsEditor extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            domainError: ''
        }
    }
    
    handleHttp(domain) {
        const http = 'http://'; const https = 'https://'; const www = 'www.'
        if (domain.includes(http)) {
            domain = domain.replace(http, '')   
        } else if (domain.includes(https)) {
            domain = domain.replace(https, '')
        } else if (domain.includes(www)) {
            domain = domain.replace(www, '')
        }
        
        return domain
    }
    
    renderNameInput() {
        const {classes, state, setState} = this.props       
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    Widget Name
                </Typography>
                <TextField          
                    className={classes.textField}
                    label="Name"
                    style={{marginBottom: '2px'}}
                    value={state.settings.name}
                    onChange={(event) => {
                        let newState = {...state}
                        newState.settings.name = event.target.value
                        setState(newState)
                    }}
                    helperText="Give your widget a name"
                />
            </Paper>    
        )
    }
    
    renderShowOnExitIntent() {
        const {classes, state, setState} = this.props
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    Show on Exit Intent
                </Typography>
                <FormControlLabel
                    control={
                      <Switch checked={state.settings.onExit} onChange={() => {
                          let newState = {...state}
                          newState.settings.onExit = !state.settings.onExit
                          setState(newState)
                      }} />
                    }
                    label=" Show on Exit Intent"
                />
            </Paper>
        )
    }
    
    renderDomain() {
        const {classes, state} = this.props
        const {domainError} = this.state
        const domain = state.domain
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    Your Website
                </Typography>
                <TextField
                    className={classes.textField}
                    onBlur={() => this.props.setState({domain: domain})}
                    id="domain"
                    label="Domain"
                    value={domain}
                    onChange={(event) => {
                        const domain = this.handleHttp(event.target.value)
                        this.props.setState({domain})
                    }}
                    placeholder="Please enter your website domain for this widget"
                    error={domainError ? true : false}
                    helperText={domainError ? domainError : false}
                />
            </Paper>    
        )
    }

    render() {
        const {classes, state, setState} = this.props       
        const headerText = 'Widget Settings' 
        return (            
            <main className={classes.content}>
            <PageHeader title={headerText} modal={(this.props.edit) ? true : false}/>
            <Container maxWidth={keys.CONTAINER_SIZE}>
                {this.renderNameInput()}
                {this.renderDomain()} 
                <Device state={state} setState={setState}/>
                <Duration state={state} setState={setState}/>
            </Container>
            </main>
        )
    }
}

const useStyles = theme => ({    
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        paddingBottom: theme.spacing(3),
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    paper: {
        padding: theme.spacing(3, 5),
        marginTop: theme.spacing(4)
    },    
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        color: 'white',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        fontSize: '13px',                
    },
    secondaryButton: {        
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        fontSize: '13px',                
    },
    formControl: {
        margin: theme.spacing(1, 0),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    textField: {
        marginBottom: 10,
        width: 360
    }
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(SettingsEditor));