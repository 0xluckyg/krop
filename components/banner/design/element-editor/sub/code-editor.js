import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import {modifyProperty, getProperty} from './functions'
import keys from '../../../../../config/keys'

class CodeEditor extends React.Component {
    constructor(props) {
        super(props)
    }

    modifyProperty(value) {
        const {type, property} = this.props
        const {element} = this.props
        modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType: type, 
            property, 
            value
        })
    }
    
    getProperty() {
        const {type, property} = this.props
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType: type, 
            property
        })
    }

    render() {
        const {classes, label, description} = this.props       

        return (
            <React.Fragment>
                <TextField
                    className={classes.html}
                    value={this.getProperty()}
                    onChange={(event) => this.modifyProperty(event.target.value)}
                    id="outlined-multiline-static"
                    label={label}
                    multiline
                    rows="8"
                    defaultValue=""
                    variant="outlined"
                />
                <p className={classes.supportText}>{description}</p>
            </React.Fragment>
        );
    }
}

const useStyles = theme => ({    
    html: {
        marginTop: 15,
        width: '100%'
    },
    supportText: {
        fontSize: 12,
        color: keys.APP_COLOR_GRAY_DARKEST
    }
})

export default withStyles(useStyles)(CodeEditor)