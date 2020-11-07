import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getUserAction} from '../redux/actions';
import Authorization from '../components/authentication/authorize-modal';
import Header from './header'

class Layout extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        return (
            <div>
                <Authorization/>
        	    <Header/>
            	{this.props.children}
            </div>
        );
    }
}

function mapStateToProps({routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer}) {
    return {routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);