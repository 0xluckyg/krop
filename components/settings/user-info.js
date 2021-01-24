import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const emailValidator = require("email-validator");
const validUrl = require('valid-url')
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {getUserResolveAction, getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';

let strings = new LocalizedStrings({
    en:{
        submitError: "Couldn't submit. Please try refreshing the app",
        validityError: "Please enter a valid email",
        nameError: "Please enter your name",
        domainError: "Please enter a valid domain name",
        updatedAlert: "Info updated!",
        emailExistsError: "Email exists. Please try another email",
        saveError: "Couldn't save your info. Please try again later",
        nameLabel: "Name",
        emailLabel: "Email",
        domainLabel: "Domain",
        aboutYouLabel: "About you",
        changeLabel: "Change"
    },
    kr: {
        submitError: "저장에 실패했어요. 잠시후 다시 시도해 주세요",
        validityError: "올바른 이메일을 입력해 주세요",
        nameError: "이름을 입력해 주세요",
        domainError: "올바른 도메인 이름을 입력해 주세요",
        updatedAlert: "저장 했어요!",
        emailExistsError: "이메일이 사용중 이에요. 다른 이메일을 시도해 보세요!",
        saveError: "저장에 실패했어요. 잠시후 다시 시도해 주세요",
        nameLabel: "이름",
        emailLabel: "이메일",
        domainLabel: "도메인",
        aboutYouLabel: "나에관해",
        changeLabel: "바꾸기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ChangeUserInfo extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            
            email: '',
            emailError: '',
            name: '',
            nameError: '',
            domain: undefined,
            domainError: ''
        }
    }
    
    updateInfo() {
        const user = this.props.getUserReducer
        
        if (!user || !Object.keys(user).length) return
        const {name, email, domain} = user
        if (name && (!this.state.name || this.state.name == '')) this.setState({name})
        if (email && (!this.state.email || this.state.email == '')) this.setState({email})
        if (domain && (!this.state.domain && this.state.domain != '')) this.setState({domain})
    }
    
    componentDidMount() {
        this.updateInfo()
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.updateInfo()
    }
    
    handleHttp(domain) {
        const http = 'http://'; const https = 'https://'; const www = 'www.'
        if (domain.includes(http)) {
            domain = domain.replace(http, '')   
        } else if (domain.includes(https)) {
            domain = domain.replace(https, '')
        } else if (domain.includes(www)) {
            domain = domain.replace(www, '')
        }
        
        return domain
    }
    
    validate() {
        if (!this.props.getUserReducer._id) {
            this.props.showToastAction(true, strings.submitError, 'error')
            return false
        }
        
        let {name, email, domain} = this.state
        if (!domain.includes('https://') || !domain.includes('http://')) domain = 'https://' + domain
        
        if (!emailValidator.validate(email)) {
            this.setState({emailError: strings.validityError})
            return false
        } else if (!name || name == '') {
            this.setState({nameError: strings.nameError})
            return false
        } else if (this.state.domain != '' && !validUrl.isWebUri(domain)) {
            this.setState({domainError: strings.domainError})
            return false
        } else {
            return true
        }
    }
    
    submitInfo() {
        let valid = this.validate()
        if (!valid) return
        
        const {name, email, domain} = this.state
        const {_id} = this.props.getUserReducer
        const params = { name, email, domain, _id }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/update-user', params)
        .then((res) => {
            this.props.getUserResolveAction(res.data)
            this.props.showToastAction(true, strings.updatedAlert, 'success')
            this.setState({isLoading:false, isOpen: false})
        }).catch((err) => {
            console.log('err: ', err)
            if (err.response && err.response.data) {
                this.props.showToastAction(true, strings.emailExistsError, 'error')
            } else {
                this.props.showToastAction(true, strings.saveError, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }
    
    renderUserInfo() {
        const { classes } = this.props;
        const { name, nameError, email, emailError, domain, domainError } = this.state;
        return (
            <Fragment>
                <TextField
                    autoFocus
                    className={classes.textFieldTop}
                    id="name"
                    label={strings.nameLabel}
                    value={name}
                    onChange={(event) => {
                        this.setState({name:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.nameLabel}
                    error={nameError ? true : false}
                    helperText={nameError ? nameError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="email"
                    label={strings.emailLabel}
                    value={email}
                    onChange={(event) => {
                        this.setState({email:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.emailLabel}
                    error={emailError ? true : false}
                    helperText={emailError ? emailError : false}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    id="website"
                    label={strings.domainLabel}
                    value={domain}
                    onChange={(event) => {
                        const domain = this.handleHttp(event.target.value)
                        this.setState({domain})
                    }}
                    margin="normal"
                    placeholder={strings.domainLabel}
                    error={domainError ? true : false}
                    helperText={domainError ? domainError : false}
                    fullWidth
                />
            </Fragment>
        )
    }

    render() {
        const {classes} = this.props
        return (            
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.aboutYouLabel}
                </Typography><br/>     
                {this.renderUserInfo()}
                <Button 
                    onClick={() => this.submitInfo()}
                    size="large"
                    variant="outlined" 
                    color="primary" 
                    className={classes.button}
                    disabled={this.state.isLoading}
                >
                    {strings.changeLabel}
                </Button> 
            </Paper>
        )
    }
}

const useStyles = theme => ({    
    paper: {
        padding: theme.spacing(3, 5),
        display: 'flex',
        flexDirection: 'column'
    },    
    textFieldTop: {
        width: 300,
        marginTop: 0,
        fontSize: '15px'
    },
    textField: {
        width: 300,
        fontSize: '15px'
    },
    button: {         
        marginBottom: theme.spacing(2),
        marginTop: 40,
        fontSize: '13px',     
        width: 200
    },
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserResolveAction, getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ChangeUserInfo));