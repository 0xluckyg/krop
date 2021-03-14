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
                        src={`https://www.youtube.com/embed/iy8IkfJjezo`}
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