import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

class PropertyHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes, title, Button, Icon} = this.props
        
        return (
            <div className={classes.headerContainer}>
                { (Icon) ? <Icon/> : null }
                <Typography className={classes.title} variant="subtitle2" gutterBottom>
                    {title}
                </Typography>
                { (Button) ? <Button/> : null }
            </div>
        )
    }
}


const useStyles = theme => ({  
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        marginBottom: 13
    }
})

export default withStyles(useStyles)(PropertyHeader)