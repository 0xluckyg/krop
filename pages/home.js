import React from 'react';

import Create from './campaigns/create'

//Shows settings on index as default
class Home extends React.Component {

    render() {        
        return (
            <Create/>
        )
    }
}

export default Home;