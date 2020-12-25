// import React from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router'
// import keys from '../../config/keys'
// const URL = require('url');

import React from 'react';
import keys from '../../config/keys'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import PageHeader from '../reusable/page-header'
import PageFooter from '../reusable/page-footer';

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
                    Email
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty('Email', email ? email : "No Email")}
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
                    Phone number
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty('Phone', phone ? phone : "No Number")}
                </Paper>    
            </React.Fragment>
        )
    }
    
    formatName(profile) {
        const {firstName, lastName} = profile.name
        const first = firstName ? firstName : ''
        const last = lastName ? ' ' + lastName : ''
        if (!first && !last) return 'N/A'
        return first + last
    }
    
    formatAddress(profile) {
        let {address1, address2, city, state, country, zip} = profile.address
        
        if (!address1 && !address2 && !city && !state && !country && !zip) return 'N/A'
        
        address1 = address1 ? address1 : ''
        address2 = address2 ? ' ' + address2 + ',': ''
        city = city ? ' ' + city : ''
        state = state ? ' ' + state : ''
        zip = zip ? ' ' + zip + ',': ''
        country = country ? ' ' + country : ''
        return address1+address2+city+state+zip+country
    }
    
    formatDate(ISO) {
        if (!ISO) return 'N/A'
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let date = new Date(Date.parse(ISO))
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return `${time} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
    }
    
    renderProfile() {
        let {classes, profile} = this.props

        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    Profile
                </Typography> 
                <Paper className={classes.paper}>

                    {this.renderProperty('Name', this.formatName(profile))}
                    {this.renderProperty('Address', this.formatAddress(profile))}
                </Paper>    
            </React.Fragment>
        )
    }
    
    renderAttributes() {
        const {classes, profile} = this.props
        return (
            <React.Fragment>
                <Typography variant="h5" gutterBottom>
                    Attributes
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty('Browser', profile.browser ? profile.browser : "N/A")}
                    {this.renderProperty('Device', profile.device ? profile.device : "N/A")}
                    {this.renderProperty('Created At', this.formatDate(profile.createdAt))}
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