import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {showAuthorizeModalAction} from '../redux/actions';
import keys from '../config/keys'

let strings = new LocalizedStrings({
    us:{
        loginLabel: "Login",
        signupLabel: "Sign up for free"
    },
    kr: {
        loginLabel: "로그인",
        signupLabel: "회원가입"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class Header extends React.Component {
    constructor(props) {
        super(props)        
    }
    
    
    renderLogo() {
        const {classes} = this.props
        
        return (
			<a>
				<img className={classes.headerLogo} src="../static/app/logo.svg"/>
			</a>
        )
    }
    
    renderButtons() {
        const {classes} = this.props
        
        return (
            <div className={classes.buttonsContainer}>
				<button className={classes.logInButton} onClick={() => this.props.showAuthorizeModalAction('login')}>{strings.loginLabel}</button>
				<button className={classes.signUpButton} onClick={() => this.props.showAuthorizeModalAction('signup')}>{strings.signupLabel}</button>
			</div>
        )
    }

    render() {
        const {classes} = this.props
        return (
    		<header className={classes.mainHeader}>
    		    {this.renderLogo()}
    		    {this.renderButtons()}
    		</header>
        );
    }
}

const useStyles = theme => ({
    mainHeader: {
        position: 'fixed',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'white',
        top: 0,
        left: 0,
        width: '100%',
        height: 70,
    },
    headerLogo: {
        height: 50,
        paddingLeft: 60
    },
    
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 60
    },
    logInButton: {
        borderRadius: 3,
        marginRight: 10,
        fontSize: 14,
        padding: '4px 20px',
        color: keys.APP_COLOR_GRAY_DARKER,
        backgroundColor: 'white',
        font: 'helvetica',
        border: `1px solid ${keys.APP_COLOR_GRAY_DARKER}`,
        transition: '0.2s',
        '&:focus': {
            outline: 'none'
        },
        '&:hover': {
            opacity: 0.8,
            transition: '0.2s',
            cursor: 'pointer'
        }
    },
    signUpButton: {
        borderRadius: 3,
        fontSize: 14,
        padding: '5px 20px',
        color: 'white',
        backgroundColor: keys.APP_COLOR,
        border: 'none',
        transition: '0.2s',
        '&:focus': {
            outline: 'none'
        },
        '&:hover': {
            opacity: 0.8,
            transition: '0.2s',
            cursor: 'pointer'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
})

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Header));