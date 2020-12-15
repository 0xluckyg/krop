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
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import {getUserAction, showToastAction, isLoadingAction} from '../../redux/actions';
import PageHeader from '../../components/reusable/page-header'
import PageFooter from '../../components/reusable/page-footer';

class NoContent extends React.Component {   
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: false,
            emailTag: '',
            mobileTag: '',
            profileTag: ''
        }
    }
    
    handleAddTag(type) {
        const tag = this.state[type+'Tag']
        
        let newProfile = JSON.parse(JSON.stringify(this.props.profile))
        let tags = newProfile[type].tags

        const special = /[^A-Za-z0-9]/
        if (tags.includes(tag) || special.test(tag)) return
        tags = [...tags, tag]
        
        newProfile[type].tags = tags
        
        let temporaryTag = {}
        temporaryTag[type+'Tag'] = ''
        this.setState(temporaryTag)
        this.props.setProfile(newProfile)
    }
    
    handleDeleteTag(i, type) {
        let newProfile = JSON.parse(JSON.stringify(this.props.profile))
        let tags = newProfile[type].tags
        let newTags = [...tags]
        newTags.splice(i, 1)
        newProfile[type].tags = newTags
        this.props.setProfile(newProfile)
    }
    
    renderTagChips(tags, type) {
        const {classes} = this.props
        return (
            <div>
                <div className={classes.tagContainer}>
                    <TextField      
                        autoFocus
                        label="Add Tag"
                        style={{marginBottom: '2px'}}
                        value={this.state[type+'Tag']}
                        onChange={(event) => {
                            if (type == 'email') {
                                this.setState({emailTag: event.target.value})   
                            } else if (type == keys.MOBILE_PROPERTY) {
                                this.setState({mobileTag: event.target.value})
                            } else {
                                this.setState({profileTag: event.target.value})
                            }
                        }}
                        onKeyPress={event => {
                            if (event.charCode === 13) { // enter key pressed
                                event.preventDefault();
                                this.handleAddTag(type)
                            } 
                        }}
                        helperText="Ex. subscribers"
                        className={classes.formControl}
                    />
                    <IconButton  className={classes.addButton}  onClick={() => this.handleAddTag(type)} 
                    size="small" variant="contained" color="primary">
                        <AddIcon className={classes.addButtonIcon} fontSize="small" />
                    </IconButton >
                </div>
                <div className={classes.chipsContainer}>
                    {tags.map((tag, i) => {
                        return (
                            <Chip
                                key={tag}
                                label={tag}
                                onDelete={() => this.handleDeleteTag(i, type)}
                                className={classes.chip}
                            />
                        );
                    })}
                </div>  
            </div>
        )
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
                    {this.renderProperty('Email', email.value ? email.value : "No Email")}
                    {this.renderProperty('Last Active', this.formatDate(email.lastActive))}
                    {this.renderProperty('Last Update', this.formatDate(email.updatedAt))}
                    {this.renderTagChips(email.tags, 'email')}
                </Paper>    
            </React.Fragment>
        )
    }
    
    renderMobile() {
        const {classes, profile} = this.props
        const mobile = profile.mobile
        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    Mobile
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty('Mobile', mobile.value ? mobile.value : "No Number")}
                    {this.renderProperty('Last Active', this.formatDate(mobile.lastActive))}
                    {this.renderProperty('Last Update', this.formatDate(mobile.updatedAt))}
                    {this.renderTagChips(mobile.tags, keys.MOBILE_PROPERTY)}
                </Paper>    
            </React.Fragment>
        )
    }
    
    formatName(profile) {
        const first = profile.firstName ? profile.firstName : ''
        const last = profile.lastName ? ' ' + profile.lastName : ''
        if (!first && !last) return 'N/A'
        return first + last
    }
    
    formatAddress(profile) {
        let {address1, address2, city, state, country, zip} = profile
        
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
        profile = profile.profile

        return (
            <React.Fragment>
                 <Typography variant="h5" gutterBottom>
                    Profile
                </Typography> 
                <Paper className={classes.paper}>
                    {this.renderProperty('Name', this.formatName(profile))}
                    {this.renderProperty('Address', this.formatAddress(profile))}
                    {this.renderProperty('Organization', profile.organization ? profile.organization : "N/A")}
                    {this.renderProperty('Last Active', this.formatDate(profile.lastActive))}
                    {this.renderProperty('Last Update', this.formatDate(profile.updatedAt))}
                    {this.renderTagChips(profile.tags, 'profile')}
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
                    {this.renderProperty('Sign Up Location', profile.path ? profile.path : 'N/A')}
                    {this.renderProperty('Browser', profile.browser ? profile.browser : "N/A")}
                    {this.renderProperty('Device', profile.device ? profile.device : "N/A")}
                    {this.renderProperty('Created At', this.formatDate(profile.createdAt))}
                </Paper> 
            </React.Fragment>        
        )
    }
    
    renderFooter() {
        return (
            <PageFooter
                isLoading={this.state.isLoading}
                saveLabel="Save"
                discardLabel="Discard"
                showSave={true}
                showDiscard={true}
                saveAction={() => {
                    const newProfile = this.props.profile
                    console.log("newP:", newProfile)
                    this.props.handleEdit({...newProfile}, () => this.setState({isLoading: false}))
                }}
                discardAction={() => {
                    this.setState({isLoading:false})
                    this.props.backAction()
                }}
            />    
        )
    }
    
    render() {
        const { classes, backAction } = this.props;
        return (
            <main className={classes.content}>   
                <PageHeader paddingTop title="Profile" modal={false} action={() => backAction()}/>
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    <div className={classes.sectionPaper}>
                        {this.renderEmail()}
                        <br/>
                        {this.renderMobile()}
                    </div>            
                    <div className={classes.sectionPaper}>
                        {this.renderProfile()}
                    </div>          
                    <div className={classes.sectionPaper}>
                        {this.renderAttributes()}   
                    </div>            
                </Container>
                {this.renderFooter()}
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
        // flex: 1,
        padding: 20,
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
    tagContainer: {
        display: 'flex', alignItems: 'center', flex: 1, marginTop: 10
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