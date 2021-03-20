import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import Layout from './layout'
import Main from './main'
import Main2 from './main2'
import Carousel from './carousel'
import Toast from '../components/reusable/toast'

class Index extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        return (
            <Layout>
                <Main/>
                {/* <Main2/> */}
                <Carousel/>
                <Toast/>
                <CssBaseline />
            </Layout>
        );
    }
}

export default Index

