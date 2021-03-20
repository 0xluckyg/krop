import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from '@material-ui/core/styles';
import LocalizedStrings from 'react-localization';

import {showAuthorizeModalAction} from '../redux/actions';
import keys from '../config/keys'

// “We see our customers as invited guests to a party, and we are the hosts. It’s our job to make the customer experience a little bit better.” – Jeff Bezos, Founder Amazon
let strings = new LocalizedStrings({
    us:{
        demoLink: "https://www.youtube.com/embed/j0bAgdMIPcw"
    },
    kr: {
        demoLink: "https://www.youtube.com/embed/iy8IkfJjezo"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class Main extends React.Component {
    constructor(props) {
        super(props)        
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.mainContainer}>
                <div className={classes.topContainer}>
                    <iframe
                        allow='autoplay'
                        className={classes.iframe}
                        // width='100vh'
                        // height='100vh'
                        width="853"
                        height="480"
                        src={strings.demoLink}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded youtube"
                    />
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    iframe:{
        height: 'calc(90vh - 70px)',
        width: '90vw',
        borderRadius: 10,

        [theme.breakpoints.down('md')]: {
            height: '270px',
            width: '90vw'
        }
    },
    mainContainer: {
        backgroundColor: 'white',
        marginTop: 70,

        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        
        [theme.breakpoints.down('md')]: {
            height: '300px',
        }
    },
    topContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        
        [theme.breakpoints.down('lg')]: {
            flexDirection: 'column'
        }
    },
})

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Main));