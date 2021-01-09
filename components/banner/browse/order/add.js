import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { GoogleLogin } from 'react-google-login';
const emailValidator = require("email-validator");

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import Preview from './card-preview'
import {showToastAction} from '../../../../redux/actions';
import keys from '../../../../config/keys'

//A pop up to ask users to login or signup
class AddModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            count: 1
        }
    }

    handleAddToCart() {
        let { setState, state } = this.props;
        let {orders, currentAdd} = state
        orders = {...orders}
        orders[currentAdd._id] = {
            count: this.state.count,
            banner: currentAdd
        }
        setState({orders})
    }

    render() {
        const { classes, state, setState } = this.props;
        const { currentAdd } = state

        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={currentAdd ? true : false}
                onClose={() => {
                    setState({currentAdd: undefined})
                }}
            >
                <div className={classes.paper}>
                    <Preview
                        state={state} 
                        setState={setState} 
                        banner={currentAdd}
                    />
                    <div className={classes.buttonContainer}>          
                        <Button 
                            disabled={this.state.isLoading}
                            onClick={() => this.handleAddToCart()} 
                            variant="contained" 
                            size="large" 
                            color="primary" 
                            className={classes.button}
                        >
                                ADD TO CART
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    paper: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        width: 'auto',
        maxWidth: '90%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(6),
        borderRadius: 5,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
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
        width: 200,        
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(mapDispatchToProps)(withStyles(useStyles)(AddModal));