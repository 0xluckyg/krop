import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from '@material-ui/core/styles';

import {showAuthorizeModalAction} from '../redux/actions';
import keys from '../config/keys'

class Main extends React.Component {
    constructor(props) {
        super(props)        
    }

    renderTopPart() {
        const {classes} = this.props
        return (
            <div className={classes.topContainer}>
                <div className={classes.mainImageContainer}>
                    <img className={classes.mainImage} src="../static/landing/main.png"/>
                </div>
                <div className={classes.textContainer}>
                    <h1 className={classes.title}>
                        The Online Popup Designer
                    </h1>
                    <p className={classes.subtitle}>
                        START COLLECTING CUSTOMERS FROM YOUR WEBSITE
                    </p>
                    <p className={classes.subText}>
                        Add a gif, animate your text and colors, experiment with different shapes and create a lead generator limited only by your imagination.
                    </p>
                    <button onClick={() => this.props.showAuthorizeModalAction(true)} className={classes.button}>
                        Create a popup
                    </button>
                </div>
            </div>
        )
    }

    renderBottomPart() {
        const {classes} = this.props
        return (
            <div className={classes.bottomContainer}>
                <div className={classes.compatibleContainerFiller}/>
                <div className={classes.compatibleContainer}>
                    <p className={classes.compatibleText}>Compatible with the following and more</p>
                    <div className={classes.compatibleLogoContainer}>
                        <img className={classes.compatibleLogo1} src="../static/landing/shopify.svg"/>
                        <img className={classes.compatibleLogo2} src="../static/landing/hubspot.svg"/>
                        <img className={classes.compatibleLogo3} src="../static/landing/mailchimp.png"/>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.mainContainer}>
                {this.renderTopPart()}
                {this.renderBottomPart()}
            </div>
        );
    }
}

const useStyles = theme => ({
    mainContainer: {
        backgroundColor: keys.APP_COLOR,
        marginTop: 70,

        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)',
        
        [theme.breakpoints.down('md')]: {
            height: 'auto',
        }
    },
    topContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: keys.APP_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
        }
    },
    textContainer: {
        paddingRight: 50,
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        flex: 3.5,
        
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30
        }
    },
    title: {
        fontWeight: 500,
        fontSize: 45,
        color: 'white',
        
        [theme.breakpoints.down('md')]: {
            textAlign: 'center'
        }
    },
    subtitle: {
        fontSize: 10,
        color: keys.APP_COLOR_GRAY,
        
        [theme.breakpoints.down('md')]: {
            textAlign: 'center'
        }
    },
    subText: {
        color: 'white',
        
        [theme.breakpoints.down('md')]: {
            textAlign: 'center'
        }
    },
    bottomContainer: {
        height: 120,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
        [theme.breakpoints.down('sm')]: {
            padding: 30,
            height: 'auto'
        }
    },
    compatibleContainerFiller: {
        flex: 6.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    compatibleContainer: {
        flex: 4.5,
        paddingRight: 50,
        
        [theme.breakpoints.down('md')]: {
            paddingLeft: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        
        [theme.breakpoints.down('sm')]: {
            paddingRight: 30,
            paddingLeft: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }
    },
    compatibleText: {
        fontSize: 10,
        margin: 0,
        marginBottom: 10,
        color: keys.APP_COLOR_GRAY_DARK,
    },
    button: {
        width: 160,
        height: 45,
        borderRadius: 30,
        fontSize: 14,
        padding: '5px 20px',
        color: keys.APP_COLOR,
        backgroundColor: 'white',
        border: 'none',
        fontWeight: 600,
        transition: '0.2s',
        '&:focus': {
            outline: 'none'
        },
        '&:hover': {
            opacity: 0.8,
            transition: '0.2s',
            cursor: 'pointer'
        }
    },
    compatibleLogoContainer: {
        width: '100%',
        display: 'flex',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    compatibleLogo1: {
        width: 110,
        [theme.breakpoints.down('sm')]: {
            width: 220,
            marginTop: 20
        }
    },
    compatibleLogo2: {
        width: 100,
        [theme.breakpoints.down('sm')]: {
            width: 200,
            marginTop: 20
        }
    },
    compatibleLogo3: {
        width: 120,
        [theme.breakpoints.down('sm')]: {
            width: 240,
            marginTop: 20
        }
    },
    mainImageContainer: {
        flex: 5.5,
        
        [theme.breakpoints.down('md')]: {
            paddingTop: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    mainImage: {
        position: 'absolute',
        width: 'auto',
        height: '90%',
        top: '50%',
        left: '0%',
        transform: 'translate(-35%, -50%)',
        
        [theme.breakpoints.down('md')]: {
            // position: 'relative',
            // objectFit: 'cover',
            position: 'static',
            width: '90%',
            height: 'auto',
            transform: 'translate(0px, 0px)'
        }
    }
})

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Main));