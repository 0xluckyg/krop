import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { GoogleLogin } from 'react-google-login';
const emailValidator = require("email-validator");

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Card from '../card'
import {showToastAction} from '../../../../redux/actions';
import keys from '../../../../config/keys'

//A pop up to ask users to login or signup
class CardPreview extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            count: 1
        }
    }

    render() {
        const { classes, state, setState, banner, count, setCount } = this.props;

        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <Card
                        interactionDisabled
                        state={state} 
                        setState={setState} 
                        banner={banner}
                    />
                </div>
                <div className={classes.wrapper}>
                    <TextField
                        type="number"
                        className={classes.textField}
                        id="count"
                        label="Count"
                        value={count}
                        onChange={(event) => {
                            setCount(event.target.value)
                        }}
                        margin="normal"
                        placeholder="How many would you like to order?"
                        fullWidth
                    />
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({
    container: {
        
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
    textField: {
        width: 300
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(mapDispatchToProps)(withStyles(useStyles)(CardPreview));