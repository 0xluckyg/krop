import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';
import keys from '../../config/keys'

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
    
     changePassword() {
        this.setState({isLoading:true})

        const params = {
            password: this.state.password
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
            this.setState({isLoading: false})
        }).catch(() => {
            this.props.showToastAction(true, `We couldn't reset the password. Please try again later.`, 'error')
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
                    Change Password
                </Typography><br/>                 
                {changingPassword ? 
                    <Fragment>
                        <TextField
                            autoFocus
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
                    Change
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