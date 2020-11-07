import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import Toast from '../reusable/toast'
import { NAV_WIDTH } from '../../config/keys'
import Navigation from './navigation'
import PaymentPlanModal from '../payment/payment-modal'
import Onboarding from '../onboarding/user-info'

//layout to show topbar and navigation on every page
class Layout extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            key: this.props.getUserReducer.key,
            navOpen: false
        };
    }
    
    static getDerivedStateFromProps(nextProps) {
        const key = nextProps.getUserReducer.key                        
        return ({key})
    }

    componentDidMount() {
        //get user and save it to the reducer on app mount
        if (!this.props.getUserReducer.key) {            
            this.props.getUserAction();
        }
    }

    render() {
    const { classes, Component, route } = this.props;
    return (
        <div className={classes.root}>
            <Onboarding user={this.props.getUserReducer}/>
            <Toast/>
            <PaymentPlanModal/>
            <CssBaseline />
            
            <Navigation 
                open={this.state.navOpen} 
                route={route} 
                closeNav={() => this.setState({navOpen: false})}
                startLoading={() => this.props.isLoadingAction(true)}
            />            
            {Component()}
        </div>
    );
    }
}

const useStyles = theme => ({
    root: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden'
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Layout));