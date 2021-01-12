import React from 'react'

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

class SubHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes, title, Button} = this.props
        
        return (
            <div className={classes.subHeader}>
                <p className={classes.caption}>
                    {title}
                </p>
                { (Button) ? <Button/> : null}
            </div>
        )
    }
}


const useStyles = theme => ({  
    subHeader: {
        marginBottom: 8,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    caption: {
        margin: 0,
        color: 'rgba(0, 0, 0, 0.9)'
    }
})

export default withStyles(useStyles)(SubHeader)