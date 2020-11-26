import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const URL = require('url');

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from './toast'

class NoContent extends React.Component {   
    constructor(props) {
        super(props)
    }

    render() {
        const { classes, iconPath, text, subText, actionText, action, footerText, isLoading } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <img className={classes.mainIcon} src={iconPath}/>
                    <div className={classes.mainText}>
                        <h3 className={classes.h2}> 
                            {text}
                        </h3>
                        <p className={classes.p}>
                            {subText}
                        </p>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button 
                            disabled={isLoading ? isLoading : false}
                            onClick={action} 
                            variant="contained" 
                            size="medium" 
                            color="primary" 
                            className={classes.button}
                        >
                            {actionText}
                        </Button>
                    </div>
                    <p className={classes.subText}>
                        {footerText}
                    </p>  
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    logo: {
        width: 200,
        margin: '20px 0px 40px 0px'
    },
    mainIcon: {
        width: 100,
        marginBottom: 20,
        userDrag: 'none',
        userSelect: 'none'
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
    button: {
        margin: '0px 10px 0px 10px',
        color: 'white'
    },
    subText: {
        fontSize: 12,
        fontWeight: 200,
        marginTop: 50,
        color: 'gray'
    }
})

function mapStateToProps({routerReducer, isLoadingReducer, showToastReducer, getUserReducer}) {
    return {routerReducer, isLoadingReducer, showToastReducer, getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(NoContent));