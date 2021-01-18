import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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

let strings = new LocalizedStrings({
    en:{
        campaignNameLabel: "Campaign name",
        campaignNameDescription: "Give your campaign a name",
        pathLabel: "This campaign's path: ",
        pathDescription: "Please enter your campaign path",
        enabledLabel: "Enabled",
        campaignEnabledLabel: "Campaign enabled",
        campaignSettingsLabel: "Campaign settings"
    },
    kr: {
        campaignNameLabel: "캠페인 이름",
        campaignNameDescription: "캠페인의 이름을 정해주세요",
        pathLabel: "이 캠페인의 경로: ",
        pathDescription: "캠페인의 경로를 정해주세요: ",
        enabledLabel: "캠페인 켜기",
        campaignEnabledLabel: "캠페인 활성화",
        campaignSettingsLabel: "캠페인 설정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class SettingsEditor extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            pathError: ''
        }
    }
    
    handleHttp(path) {
        const http = 'http://'; const https = 'https://'; const www = 'www.'
        if (path.includes(http)) {
            path = path.replace(http, '')   
        } else if (path.includes(https)) {
            path = path.replace(https, '')
        } else if (path.includes(www)) {
            path = path.replace(www, '')
        }
        
        return path
    }
    
    renderNameInput() {
        const {classes, state, setState} = this.props       
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.campaignNameLabel}
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
                    helperText={strings.campaignNameDescription}
                />
            </Paper>    
        )
    }
    
    renderpath() {
        const {classes, state, setState} = this.props
        const {pathError} = this.state
        const path = state.path
        const appUrl = process.env.APP_URL.replace("https://", "")
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.pathLabel}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    {state.domain}.{appUrl}/{state.path}
                </Typography>
                <TextField
                    className={classes.textField}
                    onBlur={() => {
                        let newState = {...state}
                        newState.path = path
                        setState(newState)
                    }}
                    id="path"
                    label="path"
                    value={path}
                    onChange={(event) => {
                        const path = this.handleHttp(event.target.value)
                        let newState = {...state}
                        newState.path = path
                        setState(newState)
                    }}
                    placeholder={strings.pathDescription}
                    error={pathError ? true : false}
                    helperText={pathError ? pathError : false}
                />
            </Paper>    
        )
    }

    renderEnabled() {
        const {classes, state, setState} = this.props
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.enabledLabel}
                </Typography>
                <FormControlLabel
                    control={
                      <Switch checked={state.enabled} onChange={() => {
                          let newState = {...state}
                          newState.enabled = !state.enabled
                          setState(newState)
                      }} />
                    }
                    label={strings.campaignEnabledLabel}
                />
            </Paper>
        )
    }

    render() {
        const {classes, state, setState} = this.props       
        const headerText = strings.campaignSettingsLabel
        return (            
            <main className={classes.content}>
            <PageHeader title={headerText} modal={(this.props.edit) ? true : false}/>
            <Container maxWidth={keys.CONTAINER_SIZE}>
                {this.renderNameInput()}
                {this.renderEnabled()}
                {this.renderpath()} 
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








