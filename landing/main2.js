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
        title: "QR Code based customer check-ins and surveys",
        subtitle: "START HEARING YOUR CUSTOMERS",
        description: "Add questions, referral coupons, loyalties, promotions and much more. Survey editor limited only by our imagination.",
        buttonLabel: "Create a campaign",
        integrationLabel: "Compatible with the following and more"
    },
    kr: {
        title: "QR 코드를 이용한 고객 체크인과 설문조사!",
        subtitle: "만들기 쉬운 설문조사를 통하여 고객님들과의 소통을 도와드려요",
        description: "설문조사, 체크인, 친구 추천 기능 등등 쉬운 고객관리를 체험해 보세요!",
        buttonLabel: "캠페인 만들기",
        integrationLabel: "아래의 서비스들과 연동 됩니다"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

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
                        {strings.title}
                    </h1>
                    <p className={classes.subtitle}>
                        {strings.subtitle}
                    </p>
                    <p className={classes.subText}>
                        {strings.description}
                    </p>
                    <button onClick={() => this.props.showAuthorizeModalAction(true)} className={classes.button}>
                        {strings.buttonLabel}
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
                    <p className={classes.compatibleText}>{strings.integrationLabel}</p>
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
                {/* {this.renderBottomPart()} */}
            </div>
        );
    }
}

const useStyles = theme => ({
    mainContainer: {
        backgroundColor: keys.APP_COLOR,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)',
        
        [theme.breakpoints.down('lg')]: {
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
        
        [theme.breakpoints.down('lg')]: {
            flexDirection: 'column'
        }
    },
    textContainer: {
        paddingRight: 50,
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        flex: 3.5,
        
        [theme.breakpoints.down('lg')]: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30
        }
    },
    title: {
        fontWeight: 500,
        fontSize: 45,
        color: 'white',
        
        [theme.breakpoints.down('lg')]: {
            textAlign: 'center'
        }
    },
    subtitle: {
        fontSize: 14,
        color: keys.APP_COLOR_GRAY_LIGHT,
        
        [theme.breakpoints.down('lg')]: {
            textAlign: 'center'
        }
    },
    subText: {
        color: 'white',
        fontSize: 20,
        
        [theme.breakpoints.down('lg')]: {
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
        
        [theme.breakpoints.down('lg')]: {
            display: 'none'
        }
    },
    compatibleContainer: {
        flex: 4.5,
        paddingRight: 50,
        
        [theme.breakpoints.down('lg')]: {
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
        marginTop: 20,
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
        
        [theme.breakpoints.down('lg')]: {
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
        
        [theme.breakpoints.down('lg')]: {
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