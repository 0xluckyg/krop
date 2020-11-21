import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { GoogleLogin } from 'react-google-login';
const emailValidator = require("email-validator");

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {showAuthorizeModalAction, showToastAction} from '../../redux/actions';
import keys from '../../config/keys'

//A pop up to ask users to login or signup
class AuthorizeModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            
            domain: '',
            fieldError: '',
            logInEmail: '',
            logInPassword: '',
            signUpEmail: '',
            signUpName: '',
            signUpPassword: '',
            logInEmailError: '',
            signUpEmailError: '',
            signUpNameError: '',
            signUpPasswordError: '',
            logInPasswordError: ''
        }
    }
    
    validateEmail(email) {
        return emailValidator.validate(email)
    }
    
    checkPassword() {
        const {signUpPassword} = this.state

        if (signUpPassword.length < 8) {
            this.props.showToastAction(true, `Please make your password at least 8 characters`, 'error')
            return false
        }
        
        if (signUpPassword.length > 30) {
            this.props.showToastAction(true, `Your password is too long`, 'error')
            return false
        }
        
        const upper = /[A-Z]/
        const lower = /[a-z]/
        const number = /[0-9]/

        if (!upper.test(signUpPassword) || !lower.test(signUpPassword)) {
            this.props.showToastAction(true, `Please include a upper and a lower case letter`, 'error')
            return false
        }
        
        if (!number.test(signUpPassword)) {
            this.props.showToastAction(true, `Please include a number`, 'error')
            return false
        }
        
        return true
    }
    
    sendValidationEmail(email, callback) {
        const params = { email }
        axios.post(process.env.APP_URL + '/send-validation-email', params, {
            withCredentials: true
        })
        .then(() => {
            this.setState({isLoading:false})
            callback()
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't send validation email. Please try again later.`, 'error')
            this.setState({isLoading:false})            
        })
    }
    
    handleSignUp() {
        let valid = this.validateEmail(this.state.signUpEmail)
        if (!valid) return this.setState({signUpEmailError: "Please enter a valid email"})
        valid = this.checkPassword()
        if (!valid) return this.setState({signUpPasswordError: "Please enter a valid password"})
        
        const {signUpName, signUpEmail, signUpPassword} = this.state
        const params = { name: signUpName, email: signUpEmail, password: signUpPassword }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/sign-up', params, {
            withCredentials: true
        })
        .then((res) => {
            console.log("R: ", res)
            this.setState({isLoading:false})
            this.sendValidationEmail(signUpEmail, () => {
                window.location.replace(`${process.env.APP_URL}/authentication/validate-email?email=`+signUpEmail)
            })
        }).catch((err) => {
            console.log("R: ", err)
            if (err.response && err.response.data) {
                console.log("HEY: ")
                this.props.showToastAction(true, `Email exists. Please try another email`, 'error')
            } else {
                console.log("HEY you: ")
                this.props.showToastAction(true, `Couldn't sign up. Please try again later.`, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }
    
    handleLogIn() {
        let valid = this.validateEmail(this.state.logInEmail)
        if (!valid) return this.setState({logInEmailError: "Please enter a valid email"})
        
        this.setState({isLoading: true})
        
        const {logInEmail, logInPassword} = this.state
        const params = { email: logInEmail, password: logInPassword }
        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/log-in', {
            params
        })
        .then((res) => {
            this.setState({isLoading:false})
            window.location.replace(`${process.env.APP_URL}/home`)
        }).catch(err => {
            if (err.response && err.response.data == 'no user') {
                this.props.showToastAction(true, `Couldn't log in. Please check your email or password.`, 'error')
            } else if (err.response && err.response.data == 'wrong password') {
                this.props.showToastAction(true, `Couldn't log in. Forgot your password?`, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }

    renderEmailLogin() {
        const { classes } = this.props;
        const { logInEmail, logInPassword, logInEmailError, logInPasswordError } = this.state;
        return (
            <Fragment>
                <TextField
                    className={classes.textField}
                    id="email"
                    label="Email"
                    value={logInEmail}
                    onChange={(event) => {
                        this.setState({logInEmail:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Email (e.g. vivelop@gmail.com)"
                    error={logInEmailError ? true : false}
                    helperText={logInEmailError ? logInEmailError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="pw"
                    type="password"
                    label="Password"
                    value={logInPassword}
                    onChange={(event) => {
                        this.setState({logInPassword:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Password"
                    error={logInPasswordError ? true : false}
                    helperText={logInPasswordError ? logInPasswordError : false}
                    fullWidth
                />    
            </Fragment>
        )
    }
    
    renderEmailSignup() {
        const { classes } = this.props;
        const { signUpName, signUpNameError, signUpEmail, signUpEmailError, signUpPassword, signUpPasswordError } = this.state;
        return (
            <Fragment>
                <TextField
                    className={classes.textField}
                    id="email"
                    label="Email"
                    value={signUpEmail}
                    onChange={(event) => {
                        this.setState({signUpEmail:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Email (e.g. vivelop@gmail.com)"
                    error={signUpEmailError ? true : false}
                    helperText={signUpEmailError ? signUpEmailError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="password"
                    label="Password"
                    type="password"
                    value={signUpPassword}
                    onChange={(event) => {
                        this.setState({signUpPassword:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Password"
                    error={signUpPasswordError ? true : false}
                    helperText={signUpPasswordError ? signUpPasswordError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="name"
                    label="Name"
                    value={signUpName}
                    onChange={(event) => {
                        this.setState({signUpName:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Your Name"
                    error={signUpNameError ? true : false}
                    helperText={signUpNameError ? signUpNameError : false}
                    fullWidth
                />
            </Fragment>
        )
    }
    
    renderAuthFooter() {
        const {classes} = this.props
        let showType = this.props.showAuthorizeModalReducer
        const authExplainer = showType=='login' ? null : "Don't have an account?"
        const authActionText = showType=='signup' ? "Back to Log In" : "Sign Up!"
        return (
            <div className={classes.footerWrapper}>
                <div>
                    {showType=='login' ? null : <p onClick={() => {
                        window.location.replace(`${process.env.APP_URL}/authentication/pw-recovery`)    
                    }} className={classes.forgotPassword}>Forgot Password?</p>}
                    <div className={classes.authTypeWrapper}>
                        <span className={classes.authTypeExplainer}>{authExplainer}</span> 
                        <span onClick={
                            () => this.props.showAuthorizeModalAction(showType == 'login' ? 'signup' : 'login')
                        } className={classes.authTypeText}>{authActionText}</span>
                    </div>
                </div>
            </div>    
        )
    }

    googleLogin() {
        const {classes} = this.props
        const scopes= [
            'profile',
            'email'
        ]
        let showType = this.props.showAuthorizeModalReducer
        let googleText = showType=='signup' ? 'Sign up with Google' : 'Use Google Account'
        
        return (
            <GoogleLogin
                scope={scopes.join(' ')}
                clientId={process.env.GOOGLE_API_CLIENT_ID}
                render={renderProps => (
                    <div 
                        onClick={renderProps.onClick}
                        className={classes.oAuthWrapper}>
                        <img className={classes.oAuthLogo} src="../../static/authenticate/google-logo.svg"/>
                        <p className={classes.oAuthText}>{googleText}</p>
                    </div>
                )}        
                uxMode='redirect'  
                accessType='offline'
                responseType='code'
                onSuccess={async authResult => {
                    if (!authResult.code) return
                    this.setState({isLoading: true})
                    await axios.get(process.env.APP_URL + '/google-auth', {
                        params: {code: authResult.code}
                    })
                    this.setState({isLoading: false})
                    this.props.showToastAction(true, "Authorized gmail!")
                    window.location.replace(`${process.env.APP_URL}`)
                }}
                onFailure={err => {
                    this.setState({isLoading: false})
                    console.log('Failed Google Login: ', err)
                }}
                cookiePolicy='single_host_origin'
                prompt='consent'
            />    
        )
    }

    render() {
        const { classes } = this.props;
        let showType = this.props.showAuthorizeModalReducer
        let headerText = showType ? 'Get started with our FREE trial' : 'Log in and get designing!'
        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={showType ? true : false}
                onClose={() => {                    
                    this.props.showAuthorizeModalAction(false)
                }}
            >
                <div style={modalContent} className={classes.paper}>
                    <div>
                        <IconButton  className={classes.buttonIconWrapper}  onClick={() => {                    
                            this.props.showAuthorizeModalAction(false)
                        }} 
                        size="small" variant="contained" color="primary">
                            <CloseIcon className={classes.buttonIcon} fontSize="small" />
                        </IconButton >
                        <p className={classes.mainText}>
                            {headerText}
                        </p>
                        {this.googleLogin()}
                        <div className={classes.separatorWrapper}>
                            <span className={classes.separator}>
                                Or
                            </span>
                        </div>
                        {(showType == 'signup') ? 
                            this.renderEmailSignup() :
                            this.renderEmailLogin()
                        }
                        <div className={classes.buttonContainer}>                        
                            <Button 
                                disabled={this.state.isLoading}
                                onClick={() => {
                                    showType == 'signup' ? this.handleSignUp() : this.handleLogIn()
                                }} 
                                variant="contained" 
                                size="large" 
                                color="primary" 
                                className={classes.button}
                            >
                                    {showType == 'signup' ? 'GET STARTED' : 'LOG IN'}
                            </Button>
                        </div>
                        {this.renderAuthFooter()}
                    </div>                               
                </div>
            </Modal>
        )
    }
}

const modalContent = {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
}

const useStyles = theme => ({
    textField: {
        fontSize: '15px'
    },
    mainText: {
        textAlign: "center",
        fontSize: 20,    
        paddingBottom: 10
    },
    oAuthWrapper: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 3,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0px',
        cursor: 'pointer',
        boxShadow: '0 3px 5px 0 rgba(36,50,66,.2)',
        '&:hover': {
            boxShadow: '0 6px 8px 0 rgba(36,50,66,.2)',
        },
        transition: '0.3s'
    },
    oAuthText: {
        margin: 20
    },
    oAuthLogo: {
        position: 'absolute',
        left: 0,
        width: 30,
        height: 30,
        marginLeft: 20
    },
    separatorWrapper: {
        width: '100%', height: '20px', borderBottom: '0.1px solid gray', textAlign: 'center'
    },
    separator: {
        fontSize: 60, backgroundColor: 'white', padding: '0 15px', fontSize: 15
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    paper: {
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(6),
        borderRadius: 5,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
            width: 500,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(6),
            borderRadius: 5,
            outline: 'none',
		},
		
    },
    button: {
        '&:focus': {
            outline: 'none'
        },
        color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(4),
        fontSize: '13px',
        width: '40%',        
    },
    footerWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(4)
    },
    forgotPassword: {
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
            color: keys.APP_COLOR
        },
        transition: '0.3s'
    },
    buttonIconWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        '&:focus': {
            outline: 'none'
        }
    },
    buttonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    authTypeText: {
        marginLeft: 8,
        cursor: 'pointer',
        '&:hover': {
            color: keys.APP_COLOR
        },
        transition: '0.3s'
    }
});

function mapStateToProps({showAuthorizeModalReducer}) {
    return {showAuthorizeModalReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction, showToastAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(AuthorizeModal));