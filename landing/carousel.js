import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from '@material-ui/core/styles';
import LocalizedStrings from 'react-localization';
import clsx from 'clsx';

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

class Carousel extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.container}>
                <div className={classes.carouselContainer}>
                    <img className={clsx(classes.carouselImage, classes.carouselImageLeft)} src="../static/landing/carousel1.png"/>
                    <img className={clsx(classes.carouselImage, classes.carouselImageLeft)} src="../static/landing/carousel2.png"/>
                    <img className={classes.carouselImage} src="../static/landing/carousel3.png"/>
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    container: {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,

        [theme.breakpoints.down('md')]: {
            marginTop: 30
        }
    },
    carouselContainer: {
        overflowX: 'scroll',
        display: 'flex',
        flexDirection: 'row',
        width: '90vw',
        borderRadius: 5,

        [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
        }
    },
    carouselImage: {
        borderRadius: 10,
        width: 500,
        height: 'auto',
        userDrag: 'none',

        [theme.breakpoints.down('md')]: {
            width: '90vw',
        }
    },
    carouselImageLeft: {
        marginRight: 30,

        [theme.breakpoints.down('md')]: {
            marginRight: 0,
            marginBottom: 30
        }
    }
})

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Carousel));