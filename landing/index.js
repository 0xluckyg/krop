import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import Layout from './layout'
import Main from './main'
import Toast from '../components/reusable/toast'

class Index extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        return (
            <Layout>
                <Main/>
                <Toast/>
                <CssBaseline />
            </Layout>
        );
    }
}

export default Index

