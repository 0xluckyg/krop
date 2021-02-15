import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';

let strings = new LocalizedStrings({
    us:{
        matchError: "Your passwords do not match",
        shortError: "Please make your password at least 8 characters",
        longError: "Please keep your password shorter than 9 characters",
        caseError: "Please include an upper and a lower case letter",
        changeAlert: "Changed password!",
        resetError: "We couldn't reset the password. Please try again later",
        changePasswordLabel: "Change password",
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
        changeAlert: "비밀번호를 바꿨어요!",
        resetError: "비밀번호를 바꾸지 못했어요. 잠시후 다시 시도해 주세요",
        changePasswordLabel: "비밀번호 바꾸기",
        passwordLabel: "비밀번호",
        passwordTochangeLabel: "바꿀 비밀번호",
        repeatPasswordLabel: "바꿀 비밀번호 반복",
        changeLabel: "바꾸기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')


class ChangePassword extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            password: '',
            repeatPassword: '',
            changingPassword: false,
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
    
     changePassword() {
        this.setState({isLoading:true})

        const params = {
            password: this.state.password
        }
        
        if (!this.checkPassword()) {
            this.setState({isLoading: false})
            return
        }
        
        axios.post(process.env.APP_URL + '/change-pw', params)
        .then(() => {
            this.props.showToastAction(true, strings.changePasswordLabel, 'success')
            this.setState({isLoading: false})
        }).catch(() => {
            this.props.showToastAction(true, strings.resetError, 'error')
            this.setState({isLoading:false})            
        })
    }

    render() {
        if (this.props.getUserReducer.type != 'organic') return null
        
        const {classes} = this.props          
        const {isLoading, changingPassword, password, repeatPassword} = this.state
        
        return (
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.changePasswordLabel}
                </Typography><br/>                 
                {changingPassword ? 
                    <Fragment>
                        <TextField
                            autoFocus
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
                    </Fragment> : null
                }
                <Button 
                    onClick={() => {
                        !this.state.changingPassword ? this.setState({changingPassword: true}) : this.changePassword()
                    }}
                    size="large"
                    variant="outlined" 
                    color="primary" 
                    className={classes.button}
                    disabled={isLoading}
                >
                    {strings.changeLabel}
                </Button> 
            </Paper>  
        )
    }
}

const useStyles = theme => ({    
    paper: {
        padding: theme.spacing(3, 5),
        display: 'flex',
        flexDirection: 'column'
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ChangePassword));