import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import keys from '../../../config/keys'

let strings = new LocalizedStrings({
    us:{

    },
    kr: {

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

//A pop up to ask users to login or signup
class QrStyleEditor extends React.Component {
    constructor(props){
        super(props)
        
    }

    renderStyleTags() {
        const { classes } = this.props;
        const styles = [
            "Size",
            "Logo",
            "Dots",
            "Corners",
            "Corner dots",
            "Background"
        ]
        
        return <div className={classes.tagsContainer}>
            {styles.map(style => {
                return <div className={classes.tags}>
                    {style}
                </div>
            })}
        </div>
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                {this.renderStyleTags()}
                <div>

                </div>
            </div>            
        )
    }
}

const useStyles = theme => ({
    container: {
        flex: 1,
        backgroundColor: 'grey'
    },
    tagsContainer: {

    },
    tags: {
        display: 'inline-block',
        backgroundColor: keys.APP_COLOR_GRAY,
        margin: '0px 10px 5px 0px',
        padding: '5px 10px',
        borderRadius: 20,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_DARK
        },
        fontSize: 18
    },
    tagsSelected: {
        backgroundColor: keys.APP_COLOR_GRAY_DARKER
    }
});

export default withStyles(useStyles)(QrStyleEditor);