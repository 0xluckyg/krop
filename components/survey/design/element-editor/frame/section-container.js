import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import SectionHeader from './section-header'

class SectionContainer extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes, children, title, Button} = this.props
        
        return (
            <Fragment>
                <SectionHeader
                    title={title}
                    Button={Button}
                />
                {children ? <div className={classes.sectionContainer}>
                    {children}
                </div> : null}
            </Fragment>
        )
    }
}


const useStyles = theme => ({  
    sectionContainer: {
        margin: 30,
        display: 'flex',
        flexDirection: 'column',
    },
    headerContainer: {
        width: '100%',
        backgroundColor: 'gray',
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        marginBottom: 13
    }
})

export default withStyles(useStyles)(SectionContainer)