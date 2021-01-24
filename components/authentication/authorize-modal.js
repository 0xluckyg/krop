import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { GoogleLogin } from 'react-google-login';
const emailValidator = require("email-validator");
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {showAuthorizeModalAction, showToastAction} from '../../redux/actions';
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    en:{
        pwTooShort:"Please make your password at least 8 characters",
        pwTooLong: 'Your password is too long',
        pwCaseError: 'Please include a upper and a lower case letter',
        pwNumberError: 'Please include a number',
        validationEmailError: "Couldn't send validation email. Please try again later.",
        emailError: 'Please enter a valid email',
        pwError: 'Please enter a valid password',
        emailExists: 'Email exists. Please try another email',
        signupError: "Couldn't sign up. Please try again later.",
        noUserError: "Couldn't log in. Please check your email or password.",
        wrongPwError: "Couldn't log in. Forgot your password?",
        unknownLoginError: "Couldn't log in. Please try again later",
        emailLabel: 'Email',
        pwLabel: 'Password',
        emailPlaceholder: 'Email (e.g. krop@gmail.com)',
        pwPlaceholder: 'Password (Please make it longer than 8 characters)',
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        noAccountButton: "Don't have an account?",
        backToLoginButton: "Back to Log In",
        signupText: "Sign Up!",
        googleSignupText: 'Sign up with Google',
        googleLoginText: 'Use Google Account',
        googleAuthSuccess: 'Authorized gmail!',
        googleAuthFailure: 'Failed google login. Please try again later.',
        signupText: 'Get started with our FREE trial',
        loginText: 'Log in and get designing!',
        signupButtonText: 'GET STARTED',
        loginButtonText: 'LOG IN'
    },
    kr: {
        pwTooShort:"비밀번호가 너무 짧아요. 8글자 이상으로 만들어주세요!",
        pwTooLong: "비밀번호가 너무 길어요",
        pwCaseError: "비밀번호에 대문자와 소문자를 포함해 주세요!",
        pwNumberError: '비밀번호에 숫자도 추가해 주세요!',
        validationEmailError: '확인 이메일 전송을 실패했어요. 조금 있다가 다시 시도해 주세요!',
        emailError: '제대로된 이메일을 입력해 주세요!',
        pwError: '제대로된 비밀번호를 입력해 주세요!',
        emailExists: '이 이메일은 이미 사용중이에요.',
        signupError: '계정을 만드는데 실패 하였습니다. 족므 있다가 다시 시도해 주세요!',
        noUserError: '이 계정은 존재하지 않아요.',
        wrongPwError: '로그인에 실패 하였어요. 계정을 까먹으셨나요?',
        unknownLoginError: '로그인에 실패 하였어요. 조금 있다가 다시 시도해 주세요!',
        emailLabel: '이메일',
        pwLabel: '비밀번호',
        emailPlaceholder: '이메일 (예시: krop@naver.com)',
        pwPlaceholder: '비밀번호 (8글자 이상으로 만들어 주세요)',
        nameLabel: '이름',
        namePlaceholder: '성함',
        noAccountButton: "계정이 없으시다구요?",
        backToLoginButton: "로그인 하기",
        signupText: "계정 만들기!",
        googleSignupText: '구글로 시작하기',
        googleLoginText: '구글로 로그인 하기',
        googleAuthSuccess: '구글로 로그인에 성공하였어요!',
        googleAuthFailure: '구글로 로그인에 실패하였어요.',
        signupText: '당장 공짜 체험 시작하기!',
        loginText: '로그인',
        signupButtonText: '계정 만들기',
        loginButtonText: '로그인'
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

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
            this.props.showToastAction(true, strings.pwTooShort, 'error')
            return false
        }
        
        if (signUpPassword.length > 30) {
            this.props.showToastAction(true, strings.pwTooLong, 'error')
            return false
        }
        
        const upper = /[A-Z]/
        const lower = /[a-z]/
        const number = /[0-9]/

        if (!upper.test(signUpPassword) || !lower.test(signUpPassword)) {
            this.props.showToastAction(true, strings.pwCaseError, 'error')
            return false
        }
        
        if (!number.test(signUpPassword)) {
            this.props.showToastAction(true, strings.pwNumberError, 'error')
            return false
        }
        
        return true
    }
    
    sendValidationEmail(email, callback) {
        const params = { email }
        axios.post(process.env.APP_URL + '/send-validation-email', params)
        .then(() => {
            this.setState({isLoading:false})
            callback()
        }).catch(() => {
            this.props.showToastAction(true, strings.validationEmailError, 'error')
            this.setState({isLoading:false})            
        })
    }
    
    handleSignUp() {
        let valid = this.validateEmail(this.state.signUpEmail)
        if (!valid) return this.setState({signUpEmailError: strings.emailError})
        valid = this.checkPassword()
        if (!valid) return this.setState({signUpPasswordError: strings.pwError})
        
        const {signUpName, signUpEmail, signUpPassword} = this.state
        const params = { name: signUpName, email: signUpEmail, password: signUpPassword }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/sign-up', params)
        .then((res) => {
            this.setState({isLoading:false})
            this.sendValidationEmail(signUpEmail, () => {
                window.location.replace(`${process.env.APP_URL}/authentication/validate-email?email=`+signUpEmail)
            })
        }).catch((err) => {
            if (err.response && err.response.data) {
                this.props.showToastAction(true, strings.emailExists, 'error')
            } else {
                this.props.showToastAction(true, strings.signupError, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }
    
    handleLogIn() {
        let valid = this.validateEmail(this.state.logInEmail)
        if (!valid) return this.setState({logInEmailError: strings.emailError})
        
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
                this.props.showToastAction(true, strings.noUserError, 'error')
            } else if (err.response && err.response.data == 'wrong password') {
                this.props.showToastAction(true, strings.wrongPwError, 'error')   
            } else {
                this.props.showToastAction(true, strings.unknownLoginError, 'error')   
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
                    label={strings.emailLabel}
                    value={logInEmail}
                    onChange={(event) => {
                        this.setState({logInEmail:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.emailPlaceholder}
                    error={logInEmailError ? true : false}
                    helperText={logInEmailError ? logInEmailError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="pw"
                    type="password"
                    label={strings.pwLabel}
                    value={logInPassword}
                    onChange={(event) => {
                        this.setState({logInPassword:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.pwPlaceholder}
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
                    label={strings.emailLabel}
                    value={signUpEmail}
                    onChange={(event) => {
                        this.setState({signUpEmail:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.emailPlaceholder}
                    error={signUpEmailError ? true : false}
                    helperText={signUpEmailError ? signUpEmailError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="password"
                    label={strings.pwLabel}
                    type="password"
                    value={signUpPassword}
                    onChange={(event) => {
                        this.setState({signUpPassword:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.pwPlaceholder}
                    error={signUpPasswordError ? true : false}
                    helperText={signUpPasswordError ? signUpPasswordError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="name"
                    label={strings.nameLabel}
                    value={signUpName}
                    onChange={(event) => {
                        this.setState({signUpName:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.namePlaceholder}
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
        const authExplainer = showType=='login' ? null : strings.noAccountButton
        const authActionText = showType=='signup' ? strings.backToLoginButton : strings.signupText
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
        let googleText = showType=='signup' ? strings.googleSignupText : strings.googleLoginText
        
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
                    this.props.showToastAction(true, strings.googleAuthSuccess)
                    window.location.replace(`${process.env.APP_URL}`)
                }}
                onFailure={err => {
                    this.setState({isLoading: false})
                    this.props.showToastAction(true, strings.googleAuthFailure)
                }}
                cookiePolicy='single_host_origin'
                prompt='consent'
            />    
        )
    }

    render() {
        const { classes } = this.props;
        let showType = this.props.showAuthorizeModalReducer
        let headerText = showType ? strings.signupText : strings.loginText
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
                                    {showType == 'signup' ? strings.signupButtonText : strings.loginButtonText}
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