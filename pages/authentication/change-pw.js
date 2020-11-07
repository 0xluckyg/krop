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
            this.props.showToastAction(true, `Your passwords do not match.`, 'error')
            return false
        }
        
        if (password.length < 8) {
            this.props.showToastAction(true, `Please make your password at least 8 characters`, 'error')
            return false
        }
        
        if (password.length > 15) {
            this.props.showToastAction(true, `Your password is too long`, 'error')
            return false
        }
        
        const upper = /[A-Z]/
        const lower = /[a-z]/
        const number = /[0-9]/
        const special = /[^A-Za-z0-9]/
        
        if (!upper.test(password) || !lower.test(password)) {
            this.props.showToastAction(true, `Please include a upper and a lower case letter`, 'error')
            return false
        }
        
        if (!number.test(password) || !special.test(password)) {
            this.props.showToastAction(true, `Please include a number and a special character`, 'error')
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
            this.props.showToastAction(true, `Couldn't log in. Please try again later.`, 'error')
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
        
        axios.post(process.env.APP_URL + '/change-pw', params, {
            withCredentials: true
        })
        .then(() => {
            this.props.showToastAction(true, 'Changed Password!', 'success')
            this.handleLogin()
        }).catch(() => {
            this.props.showToastAction(true, `We couldn't reset the password. Please try again later.`, 'error')
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
                    We'll send you a password recovery email.
                </h3>
                <p className={classes.p}>
                    Please enter your email you signed up with to change your password.
                </p>
            </div>
            <TextField
                className={classes.password1}
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(event) => {
                    this.setState({password:event.target.value})
                }}
                margin="normal"
                placeholder="Password to change"
                fullWidth
            />
            <TextField
                className={classes.password2}
                type="password"
                id="repeat"
                label="Repeat password"
                value={repeatPassword}
                onChange={(event) => {
                    this.setState({repeatPassword:event.target.value})
                }}
                margin="normal"
                placeholder="Repeat password"
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
                        Change Password
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