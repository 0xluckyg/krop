import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { useRouter } from 'next/router'
const URL = require('url');

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from '../../components/reusable/toast'

class ValidateEmail extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            key: this.props.getUserReducer.key,
            recoveryEmail: ''
        };
    }
    
    sendPasswordRecoveryEmail() {
        this.setState({isLoading:true})
        const params = {
            email: this.state.recoveryEmail
        }
        axios.post(process.env.APP_URL + '/send-pw-recovery-email', params, {
            withCredentials: true
        })
        .then(() => {
            this.props.showToastAction(true, 'Sent Email!', 'success')
            this.setState({isLoading:false})
        }).catch((err) => {
            if (err.response && err.response.data == 'no user') {
                this.props.showToastAction(true, `We couldn't find the email. Are you sure this is the right one?`, 'error')    
            } else {
                this.props.showToastAction(true, `We couldn't send the email. Please try again later.`, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }

    render() {
    const { classes} = this.props;
    const { recoveryEmail, recoveryEmailError } = this.props
    return (
        <div className={classes.root}>
            <Toast/>
            <CssBaseline />
            <img className={classes.logo} src='../../static/app/logo.svg'/>
            <img className={classes.emailIcon} src='../../static/authenticate/rocket.svg'/>
            <div className={classes.mainText}>
                <h3 className={classes.h2}> 
                    We'll send you a password recovery email.
                </h3>
                <p className={classes.p}>
                    Please enter your email you signed up with to change your password.
                </p>
            </div>
            <TextField
                className={classes.textField}
                id="email"
                label="Email"
                value={recoveryEmail}
                onChange={(event) => {
                    this.setState({recoveryEmail:event.target.value})
                }}
                margin="normal"
                placeholder="Email (e.g. vivelop@gmail.com)"
                error={recoveryEmailError ? true : false}
                helperText={recoveryEmailError ? recoveryEmailError : false}
                fullWidth
            />
            <div className={classes.buttonContainer}>
                <Button 
                    disabled={this.state.isLoading}
                    onClick={() => this.sendPasswordRecoveryEmail()} 
                    variant="contained" 
                    size="medium" 
                    color="primary" 
                    className={classes.button}
                >
                        Send email
                </Button>
                <Button 
                    disabled={this.state.isLoading}
                    onClick={() => {
                        this.setState({isLoading: true})
                        window.location.replace(`${process.env.APP_URL}/`)
                    }} 
                    variant="contained" 
                    size="medium" 
                    className={classes.button}
                >
                        Take me to login
                </Button>
            </div>
            <p className={classes.subText}>
                Note: Make sure you check your spam or junk folder too if you have trouble finding the password recovery link.
            </p>  
        </div>
    );
    }
}

const useStyles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    logo: {
        width: 200,
        margin: '20px 0px 40px 0px'
    },
    emailIcon: {
        width: 150,
        marginBottom: 20
    },
    mainText: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 20
    },
    h2: {
        fontSize: 30,
        fontWeight: 300,
        margin: '0px 0px 10px 0px'
    },
    textField: {
        width: 300,
        marginBottom: 40
    },
    p: {
        fontSize: 16,
        fontWeight: 300,
        margin: 0
    },
    buttonContainer: {
        marginBottom: 40
    },
    button: {
        margin: '0px 10px 0px 10px'
    },
    subText: {
        fontSize: 12,
        fontWeight: 200,
        margin: 0,
        color: 'gray'
    }
})

function mapStateToProps({routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer}) {
    return {routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ValidateEmail));