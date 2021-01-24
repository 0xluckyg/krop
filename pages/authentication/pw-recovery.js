import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';
const URL = require('url');

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from '../../components/reusable/toast'

let strings = new LocalizedStrings({
    en:{
        sentEmailAlert: "Sent email!",
        findError: "We couldn't find the email. Are you sure this is the right one?",
        sendError: "We couldn't send the email. Please try again later",
        recoveryEmailLabel: "We'll send you a recovery email.",
        enterEmailLabel: "Please enter your email you signed up with to change your password",
        emailLabel: "Email",
        emailPlaceholder: "Email (e.g. krop@gmail.com)",
        sendLabel: "Send email",
        loginLabel: "Take me to login",
        noteLabel: "Note: make sure you check your spam or junk folder too if you have trouble finding the password recovery link."
    },
    kr: {
        sentEmailAlert: "이메일을 보냈어요!",
        findError: "이메일을 찾을수 없었어요. 이 이메일이 확실 하신가요?",
        sendError: "이메일을 보낼수 없었어요. 잠시후 다시 시도해 주세요",
        recoveryEmailLabel: "비밀번호 복구 이메일을 보내드릴꼐요.",
        enterEmailLabel: "계정의 이메일을 입력해 주세요.",
        emailLabel: "이메일",
        emailPlaceholder: "이메일 (예시. krop@gmail.com)",
        sendLabel: "보내기",
        loginLabel: "로그인 창으로 가기",
        noteLabel: "만약 이메일을 받지 못하셨다면 스팸 폴더를 확인해 주세요."

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

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
        axios.post(process.env.APP_URL + '/send-pw-recovery-email', params)
        .then(() => {
            this.props.showToastAction(true, strings.sentEmailAlert, 'success')
            this.setState({isLoading:false})
        }).catch((err) => {
            if (err.response && err.response.data == 'no user') {
                this.props.showToastAction(true, strings.findError, 'error')    
            } else {
                this.props.showToastAction(true, strings.sendError, 'error')   
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
                    {strings.recoveryEmailLabel}
                </h3>
                <p className={classes.p}>
                    {strings.enterEmailLabel}
                </p>
            </div>
            <TextField
                className={classes.textField}
                id="email"
                label={strings.emailLabel}
                value={recoveryEmail}
                onChange={(event) => {
                    this.setState({recoveryEmail:event.target.value})
                }}
                margin="normal"
                placeholder={strings.emailPlaceholder}
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
                        {strings.sendLabel}
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
                        {strings.loginLabel}
                </Button>
            </div>
            <p className={classes.subText}>
                {strings.noteLabel}
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