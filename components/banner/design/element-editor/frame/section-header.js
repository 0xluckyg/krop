import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import keys from '../../../../../config/keys'

class PropertyHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes, title, Button} = this.props
        
        return (
            <div className={classes.subHeader}>
                <p className={classes.subHeaderText}>{title}</p>
                { (Button) ? <Button/> : null}
            </div>    
        )
    }
}


const useStyles = theme => ({  
    subHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    subHeaderText: {
        fontSize: 12
    },
})

export default withStyles(useStyles)(PropertyHeader)