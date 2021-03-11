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
    us:{

    },
    kr: {

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

//A pop up to ask users to login or signup
class AuthorizeModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: false
        }
    }

    render() {
        const { classes } = this.props;
        let show = this.props.show
        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={show ? true : false}
                onClose={() => {                    
                    this.props.showAuthorizeModalAction(false)
                }}
            >
                <div className={classes.paper}>
                    <div>
                        <IconButton  className={classes.buttonIconWrapper}  onClick={() => {                    
                            this.props.showAuthorizeModalAction(false)
                        }} 
                        size="small" variant="contained" color="primary">
                            <CloseIcon className={classes.buttonIcon} fontSize="small" />
                        </IconButton >
                        <p className={classes.mainText}>
                            Get your QR code
                        </p>
                        


                        <div className={classes.buttonContainer}>                        
                            <Button 
                                disabled={this.state.isLoading}
                                onClick={() => {
                                    
                                }} 
                                variant="contained" 
                                size="large" 
                                color="primary" 
                                className={classes.button}
                            >
                                    Download QR
                            </Button>
                        </div>
                    </div>                               
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    textField: {
        fontSize: '15px'
    },
    mainText: {
        textAlign: "center",
        fontSize: 20,    
        // paddingBottom: 5
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
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
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