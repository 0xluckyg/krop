// import React from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router'
// import keys from '../../config/keys'
// const URL = require('url');

import React from 'react';
import keys from '../../config/keys'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';

let strings = new LocalizedStrings({
    en:{
        emailLabel: "Email",
        noEmailLabel: "No email",
        phoneNumberLabel: "Phone number",
        phoneLabel: "Phone",
        noNumberLabel: "No Number",
        profileLabel: "Profile",
        attributesLabel: "Attributes",
        NALabel: "N/A",
        browserLabel: "Browser",
        deviceLabel: "Device",
        nameLabel: "Name",
        addressLabel: "Address",
        createdAtLabel: "Created at"

    },
    kr: {
        emailLabel: "이메일",
        noEmailLabel: "이메일 없음",
        phoneNumberLabel: "전화번호",
        phoneLabel: "번호",
        noNumberLabel: "번호 없음",
        profileLabel: "프로필",
        attributesLabel: "속성",
        NALabel: "없음",
        browserLabel: "브라우저",
        deviceLabel: "기기",
        nameLabel: "이름",
        addressLabel: "주소",
        createdAtLabel: "날짜"

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')


class NoContent extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: false
        }
    }
    renderProperty(key, value) {
        const {classes} = this.props
        return (
            <div className={classes.propertyText}><span className={classes.key}>{key}: </span>{value}</div>
        )
    }
    
    renderEmail() {
        const {classes, profile} = this.props
        const email = profile.email
        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    {strings.emailLabel}
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty(strings.emailLabel, email ? email : strings.noEmailLabel)}
                </Paper>    
            </React.Fragment>
        )
    }
    
    renderPhone() {
        const {classes, profile} = this.props
        const phone = profile.phone
        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    {strings.phoneNumberLabel}
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty(strings.phoneLabel, phone ? phone : strings.noNumberLabel)}
                </Paper>    
            </React.Fragment>
        )
    }
    
    formatName(profile) {
        const {firstName, lastName} = profile.name
        const first = firstName ? firstName : ''
        const last = lastName ? ' ' + lastName : ''
        if (!first && !last) return strings.NALabel
        return first + last
    }
    
    formatAddress(profile) {
        let {address1, address2, city, state, country, zip} = profile.address
        
        if (!address1 && !address2 && !city && !state && !country && !zip) return strings.NALabel
        
        address1 = address1 ? address1 : ''
        address2 = address2 ? ' ' + address2 + ',': ''
        city = city ? ' ' + city : ''
        state = state ? ' ' + state : ''
        zip = zip ? ' ' + zip + ',': ''
        country = country ? ' ' + country : ''
        return address1+address2+city+state+zip+country
    }
    
    formatDate(ISO) {
        if (!ISO) return strings.NALabel
        const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
        let date = new Date(Date.parse(ISO))
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return `${time} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
    }
    
    renderProfile() {
        let {classes, profile} = this.props

        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    {strings.profileLabel}
                </Typography> 
                <Paper className={classes.paper}>

                    {this.renderProperty(strings.nameLabel, this.formatName(profile))}
                    {this.renderProperty(strings.addressLabel, this.formatAddress(profile))}
                </Paper>    
            </React.Fragment>
        )
    }
    
    renderAttributes() {
        const {classes, profile} = this.props
        return (
            <React.Fragment>
                <Typography variant="h5" gutterBottom>
                    {strings.attributesLabel}
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty(strings.browserLabel, profile.browser ? profile.browser : strings.NALabel)}
                    {this.renderProperty(strings.deviceLabel, profile.device ? profile.device : strings.NALabel)}
                    {this.renderProperty(strings.createdAtLabel, this.formatDate(profile.createdAt))}
                </Paper> 
            </React.Fragment>        
        )
    }
    
    render() {
        const { classes, backAction, profile } = this.props;
        return (
            <main className={classes.content}>   
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    <div className={classes.sectionPaper}>
                        {this.renderEmail()}
                        <br/>
                        {this.renderPhone()}
                    </div>            
                    <div className={classes.sectionPaper}>
                        {this.renderProfile()}
                    </div>          
                    <div className={classes.sectionPaper}>
                        {this.renderAttributes()}   
                    </div>            
                </Container>
            </main>
        );
    }
}

const useStyles = theme => ({
    content: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        flex: 1
    },
    sectionPaper: {
        flex: 2,
        margin: '0px 20px',
        display: 'flex',
        flexDirection: 'column'
    },
    paper: {
        height: 'max-content'
    },
    
    propertyText: {
        fontSize: 14,
        marginTop: 7,
        marginBottom: 7
    },
    key: {
        fontWeight: 500,
    },
    
    formControl: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        flex: 1
    },
    addButtonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    chipsContainer: {
        marginTop: theme.spacing(1),
        flex: 1
    },
    chip: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    }
})

function mapStateToProps({routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer}) {
    return {routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(NoContent));