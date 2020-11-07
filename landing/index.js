import React from 'react';

import Layout from './layout'
import Main from './main'

class Index extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        return (
            <Layout>
                <Main/>
            </Layout>
        );
    }
}

export default Index

