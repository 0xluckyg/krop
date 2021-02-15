import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import {getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';
import PageHeader from '../../components/reusable/page-header'
import ChangePassword from '../../components/settings/change-password'
import UserInfo from '../../components/settings/user-info'
import AppColors from '../../components/settings/app-color'
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    us:{
        loggedOutAlert: "Logged out!",
        logoutError: "Couldn't logout. Please try again later",
        logoutLabel: "Logout",
        settingsTitle: "SETTINGS"
    },
    kr: {
        loggedOutAlert: "로그아웃 되었어요!",
        logoutError: "로그아웃에 실패 하였어요. 잠시후 다시 시도해 주세요",
        logoutLabel: "로그아웃",
        settingsTitle: "설정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

//Lets users customize app settings.
class Settings extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            displayColorPicker: false,

            defaultColor: keys.APP_COLOR
        }
    }

    componentDidMount() {        
        this.props.isLoadingAction(false)
    }
    
    handleLogout() {
        this.setState({isLoading: true})        
        axios.post(process.env.APP_URL + '/log-out')
        .then(() => {            
            this.props.showToastAction(true, strings.loggedOutAlert, 'success')
            this.setState({isLoading: false})
            window.location.reload()
        }).catch(() => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.logoutError, 'error')            
        })  
    }

    renderLogout() {
        const {classes} = this.props          
        const {isLoading} = this.state
        
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.logoutLabel}
                </Typography><br/>                 
                <Button 
                    onClick={() => this.handleLogout()}
                    size="large"
                    variant="outlined" 
                    color="primary" 
                    className={classes.button}
                    disabled={isLoading}
                >
                    {strings.logoutLabel}
                </Button>
            </Paper>    
        )
    }

    render() {
        const {classes} = this.props          

        return (            
            <main className={classes.content}>
                <PageHeader title={strings.settingsTitle} paddingTop/>
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    {/* <Integrations/> */}
                    {/* <br/> */}
                    <AppColors/>
                    <br/>
                    <UserInfo/>
                    <br/>
                    <ChangePassword/>
                    {this.renderLogout()}
                </Container>
            </main>
        )
    }
}

const useStyles = theme => ({    
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    content: {
        flexGrow: 1,
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    paper: {
        padding: theme.spacing(3, 5),
        display: 'flex',
        flexDirection: 'column'
    },    
    popover: {
        position: 'absolute',
        zIndex: '999',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
    color: {
        width: '40px',
        height: '40px',
        borderRadius: '2px',        
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
    password1: {
        width: 300,
        marginBottom: 0,
        marginTop: 0
    },
    password2: {
        width: 300,
        marginBottom: 40
    },
    button: {         
        marginBottom: theme.spacing(2),
        fontSize: '13px',     
        width: 200
    },
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Settings));