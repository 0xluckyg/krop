import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';
const URL = require('url');

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from '../../components/reusable/toast'

let strings = new LocalizedStrings({
    en:{
        sentEmailAlert: "Sent email!",
        sendError: "We couldn't send the email. Please try again later",
        verifyLabel: "Please take a moment to verify your email address",
        resendLabel: "Resend email",
        loginLabel: "Take me to login",
        noteLabel: "Note: make sure you check your spam or junk folder too if you have trouble finding the password recovery link."
    },
    kr: {
        sentEmailAlert: "이메일을 보냈어요!",
        sendError: "이메일을 보낼수 없었어요. 잠시후 다시 시도해 주세요",
        verifyLabel: "이메일을 인증해 주세요",
        resendLabel: "이메일 재전송",
        loginLabel: "로그인 하기",
        noteLabel: "만약 이메일을 받지 못하셨다면 스팸 폴더를 확인해 주세요."

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ValidateEmail extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            key: this.props.getUserReducer.key
        };
    }

    getQuery() {
        if (typeof window === 'undefined') return ''
        const headerURL = new URL.parse(window.location.href, true)
        const query = headerURL.query;
        return query
    }
    
    componentDidMount() {
        if (!this.getQuery().email) {
            window.location.replace(`${process.env.APP_URL}/`)    
        }
        
        //get user and save it to the reducer on app mount        
        if (!this.props.getUserReducer.key) {
            this.props.getUserAction();
        }
    }
    
    sendValidationEmail() {
        this.setState({isLoading:true})
        const params = {
            email: this.getQuery().email
        }
        axios.post(process.env.APP_URL + '/send-validation-email', params)
        .then(() => {
            this.props.showToastAction(true, strings.sentEmailAlert, 'success')
            this.setState({isLoading:false})
        }).catch((err) => {
            this.props.showToastAction(true, strings.sendError, 'error')
            this.setState({isLoading:false})            
        })
    }



    render() {
    const { classes} = this.props;
    return (
        <div className={classes.root}>
            <Toast/>
            <CssBaseline />
            <img className={classes.logo} src='../../static/app/logo.svg'/>
            <img className={classes.emailIcon} src='../../static/authenticate/mail.svg'/>
            <div className={classes.mainText}>
                <h3 className={classes.h2}> 
                    {strings.verifyLabel}
                </h3>
                <p className={classes.p}>
                    {
                        process.env.LANGUAGE == 'en' ? 
                        `We have sent an email to ${this.getQuery().email} with a confirmation link to get access to Krop.` :
                        `${this.getQuery().email} 로 이메일을 보냈습니다. 이메일을 인증해 주세요.`
                    }
                </p>
            </div>
            <div className={classes.buttonContainer}>
                <Button 
                    disabled={this.state.isLoading}
                    onClick={() => this.sendValidationEmail()} 
                    variant="contained" 
                    size="medium" 
                    color="primary" 
                    className={classes.leftButton}
                >
                        {strings.resendLabel}
                </Button>
                <Button 
                    disabled={this.state.isLoading}
                    onClick={() => {
                        this.setState({isLoading: true})
                        window.location.replace(`${process.env.APP_URL}/`)
                    }} 
                    variant="contained" 
                    size="medium" 
                    className={classes.rightButton}
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
        marginBottom: 40
    },
    h2: {
        fontSize: 30,
        fontWeight: 300,
        margin: '0px 0px 10px 0px'
    },
    p: {
        fontSize: 16,
        fontWeight: 300,
        margin: 0
    },
    buttonContainer: {
        marginBottom: 40
    },
    leftButton: {
        margin: '0px 10px 0px 10px',
        color: 'white'
    },
    rightButton: {
        margin: '0px 10px 0px 10px',
        color: 'black'
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