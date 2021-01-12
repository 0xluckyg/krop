import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import keys from '../../../../../config/keys'

class MainHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {classes, title, Button} = this.props
        
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>{title}</p>
                {Button ? <Button/> : null}
            </div>    
        )
    }
}


const useStyles = theme => ({  
    elementsHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    elementsHeaderText: {
        fontSize: 15,
        color: 'white',
        marginLeft: 20
    }
})

export default withStyles(useStyles)(MainHeader)