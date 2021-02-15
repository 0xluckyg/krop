import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const URL = require('url');
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from '../../components/reusable/toast'

let strings = new LocalizedStrings({
    us:{
        matchError: "Your passwords do not match",
        shortError: "Please make your password at least 8 characters",
        longError: "Please keep your password shorter than 9 characters",
        caseError: "Please include an upper and a lower case letter",
        loginError: "Couldn't log in. Please try again later",
        changeAlert: "Changed password!",
        resetError: "We couldn't reset the password. Please try again later",
        changePasswordLabel: "Change password",
        recoveryEmailLabel: "We'll send you a recovery email.",
        enterEmailLabel: "Please enter your email you signed up with to change your password",
        passwordLabel: "Password",
        passwordTochangeLabel: "Password to change",
        repeatPasswordLabel: "Repeat password",
        changeLabel: "Change"
    },
    kr: {
        matchError: "비밀번호들이 일치하지 않아요",
        shortError: "비밀번호를 8자 이상으로 만들어주세요",
        longError: "비밀번호를 8자 이하로 만들어주세요",
        caseError: "비밀번호에 영문 대문자와 소문자를 포함해 주세요",
        loginError: "로그인에 실패했어요. 잠시후 다시 시도해 주세요",
        changeAlert: "비밀번호를 바꿨어요!",
        resetError: "비밀번호를 바꾸지 못했어요. 잠시후 다시 시도해 주세요",
        changePasswordLabel: "비밀번호 바꾸기",
        recoveryEmailLabel: "비밀번호 변경 이메일을 보내드릴께요.",
        enterEmailLabel: "계정의 이메일을 입력해 주세요.",
        passwordLabel: "비밀번호",
        passwordTochangeLabel: "바꿀 비밀번호",
        repeatPasswordLabel: "바꿀 비밀번호 반복",
        changeLabel: "바꾸기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class ValidateEmail extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            password: '',
            repeatPassword: ''
        };
    }
    
    getQuery() {
        if (typeof window === 'undefined') return ''
        const headerURL = new URL.parse(window.location.href, true)
        const query = headerURL.query;
        return query
    }
    
    componentDidMount() {
        if (!this.getQuery().email || !this.getQuery().token) {
            window.location.replace(`${process.env.APP_URL}/`)
        }
    }
    
    checkPassword() {
        const {password, repeatPassword} = this.state
        if (password !== repeatPassword) {
            this.props.showToastAction(true, strings.matchError, 'error')
            return false
        }
        
        if (password.length < 8) {
            this.props.showToastAction(true, strings.shortError, 'error')
            return false
        }
        
        if (password.length > 15) {
            this.props.showToastAction(true, strings.longError, 'error')
            return false
        }
        
        const upper = /[A-Z]/
        const lower = /[a-z]/
        const number = /[0-9]/
        const special = /[^A-Za-z0-9]/
        
        if (!upper.test(password) || !lower.test(password)) {
            this.props.showToastAction(true, strings.caseError, 'error')
            return false
        }

        return true
    }
    
    handleLogin() {
        const {email} = this.getQuery()
        const password = this.state.password
        const params = { email, password }
        
        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/log-in', {
            params
        })
        .then((res) => {
            this.setState({isLoading:false})
            window.location.replace(`${process.env.APP_URL}`)
        }).catch(() => {
            this.props.showToastAction(true, strings.loginError, 'error')
            this.setState({isLoading:false})            
        })
    }
    
    changePassword() {
        this.setState({isLoading:true})

        const {email, token} = this.getQuery()
        const params = {
            password: this.state.password,
            email, token
        }
        
        if (!this.checkPassword()) {
            this.setState({isLoading: false})
            return
        }
        
        axios.post(process.env.APP_URL + '/change-pw', params)
        .then(() => {
            this.props.showToastAction(true, strings.changeAlert, 'success')
            this.handleLogin()
        }).catch(() => {
            this.props.showToastAction(true, strings.resetError, 'error')
            this.setState({isLoading:false})            
        })
    }

    render() {
    const { classes} = this.props;
    const { password, repeatPassword } = this.props
    return (
        <div className={classes.root}>
            <Toast/>
            <CssBaseline />
            <img className={classes.logo} src='../../static/app/logo.svg'/>
            <img className={classes.emailIcon} src='../../static//authenticate/rocket.svg'/>
            <div className={classes.mainText}>
                <h3 className={classes.h2}> 
                    {strings.recoveryEmailLabel}
                </h3>
                <p className={classes.p}>
                    {strings.enterEmailLabel}
                </p>
            </div>
            <TextField
                className={classes.password1}
                type="password"
                id="password"
                label={strings.passwordLabel}
                value={password}
                onChange={(event) => {
                    this.setState({password:event.target.value})
                }}
                margin="normal"
                placeholder={strings.passwordTochangeLabel}
                fullWidth
            />
            <TextField
                className={classes.password2}
                type="password"
                id="repeat"
                label={strings.repeatPasswordLabel}
                value={repeatPassword}
                onChange={(event) => {
                    this.setState({repeatPassword:event.target.value})
                }}
                margin="normal"
                placeholder={strings.repeatPasswordLabel}
                fullWidth
            />
            <div className={classes.buttonContainer}>
                <Button 
                    disabled={this.state.isLoading}
                    onClick={() => this.changePassword()} 
                    variant="contained" 
                    size="medium" 
                    color="primary" 
                    className={classes.button}
                >
                        {strings.changeLabel}
                </Button>
            </div>
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
    password1: {
        width: 300,
        marginBottom: 0
    },
    password2: {
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