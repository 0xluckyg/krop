import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const emailValidator = require("email-validator");
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HeaderIcon from '@material-ui/icons/PermIdentity';

import {getUserResolveAction, getUserAction, showToastAction} from '../../redux/actions';
import keys from '../../config/keys'
import ColorPicker from '../reusable/color-picker'

let strings = new LocalizedStrings({
    en:{
        submitError: "Coulnd not submit. Please try refreshing the app",
        emailError: "Please enter a valid email",
        nameError: "Please enter your name",
        emailExistsError: "Email exists. Please try another email",
        saveError: "Couldn't save your info. Please try again later",
        nameLabel: "What's your name?",
        namePlaceholder: "Name",
        emailLabel: "What's your email?",
        emailPlaceholder: "Email",
        domainLabel: "Do you have a doamin name in mind?",
        domainPlaceholder: "Domain",
        primaryAppColor: "Primary app color",
        secondaryAppColor: "Secondary app color",
        footerLabel: "Please tell us more about you",
        headerLabel: "ONE LAST STEP!",
        buttonLabel: "GET STARTED"
    },
    kr: {
        submitError: "리로딩 후 다시 시도해 주세요",
        emailError: "올바른 이메일을 입력해 주세요",
        nameError: "올바른 이름을 입력해 주세요",
        emailExistsError: "이미 사용중인 이메일 이에요. 다른 이메일을 사용해 주세요",
        saveError: "저장 오류입니다. 잠시후 다시 시도해 주세요",
        nameLabel: "이름",
        namePlaceholder: "이름",
        emailLabel: "이메일",
        emailPlaceholder: "이메일",
        domainLabel: "회사 이름이 있으신가요?",
        domainPlaceholder: "도메인",
        primaryAppColor: "메인 컬러",
        secondaryAppColor: "보조 컬러",
        footerLabel: "조금만 더 알려 주세요",
        headerLabel: "거의다 끝났어요!",
        buttonLabel: "시작하기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

//A pop up to ask users to login or signup
class OnboardingModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            isOpen: false,
            
            email: '',
            emailError: '',
            name: '',
            nameError: '',
            domain: null,
            domainError: '',
            primaryColor: '',
            secondaryColor: ''
        }
    }
    
    checkIfInfoExists() {
        const user = this.props.user
        if (!user || !Object.keys(user).length) return
        
        const {name, email, domain, primaryColor, secondaryColor} = user
        
        if (((!name || name == '') || 
        (!email || email == '') || 
        (domain == null) || 
        (primaryColor == '') || 
        (secondaryColor == '')) && !this.state.isOpen) {

            let newState = {
                name, email, isOpen: true
            }
            newState.domain = domain ? domain : ''
            if (primaryColor && (!this.state.primaryColor || this.state.primaryColor == '')) {
                newState.primaryColor = primaryColor
            } else {
                newState.primaryColor = keys.DEFAULT_PRIMARY_COLOR
            }
            if (secondaryColor && (!this.state.secondaryColor || this.state.secondaryColor == '')) {
                newState.secondaryColor = secondaryColor
            } else {
                newState.secondaryColor = keys.DEFAULT_SECONDARY_COLOR
            }
            this.setState(newState)
        }
    }
    
    componentDidMount() {
        this.checkIfInfoExists()
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.checkIfInfoExists()
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
        if (!this.props.user._id) {
            this.props.showToastAction(true, strings.submitError, 'error')
            return false
        }
        
        let {name, email, domain} = this.state
        
        if (!emailValidator.validate(email)) {
            this.setState({emailError: strings.emailError})
            return false
        } else if (!name || name == '') {
            this.setState({nameError: strings.nameError})
            return false
        } else {
            return true
        }
    }
    
    submitInfo() {
        let valid = this.validate()
        if (!valid) return
        
        let {name, email, domain, primaryColor, secondaryColor} = this.state
        
        if (domain == null) domain = ''
        const {_id} = this.props.user
        const params = { name, email, domain, primaryColor, secondaryColor, _id }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/update-user', params)
        .then((res) => {
            this.props.getUserResolveAction(res.data)
            this.setState({isLoading:false, isOpen: false})
        }).catch((err) => {
            if (err.response && err.response.data) {
                this.props.showToastAction(true, strings.emailExistsError, 'error')
            } else {
                this.props.showToastAction(true, strings.saveError, 'error')   
            }
            this.setState({isLoading:false})            
        })
    }
    
    renderInfoCollector() {
        const { classes } = this.props;
        const { name, nameError, email, emailError, domain, domainError } = this.state;
        return (
            <Fragment>
                <TextField
                    className={classes.textField}
                    id="name"
                    label={strings.nameLabel}
                    value={name}
                    onChange={(event) => {
                        this.setState({name:event.target.value})
                    }}
                    margin="normal"
                    placeholder={strings.namePlaceholder}
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
                    placeholder={strings.emailPlaceholder}
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
                    placeholder={strings.domainPlaceholder}
                    error={domainError ? true : false}
                    helperText={domainError ? domainError : false}
                    fullWidth
                />
            </Fragment>
        )
    }
    
    renderColorPicker() {
        const {classes} = this.props
        const {primaryColor, secondaryColor} = this.state
        return (
            <div className={classes.colorPickerContainer}>
                <ColorPicker
                    text={strings.primaryAppColor}
                    color={primaryColor}
                    onChange={primaryColor => this.setState({primaryColor})}
                /><br/>
                <ColorPicker
                    text={strings.secondaryAppColor}
                    color={secondaryColor}
                    onChange={secondaryColor => this.setState({secondaryColor})}
                />
                
            </div>
        )
    }
    
    renderAuthFooter() {
        const {classes} = this.props
        return (
            <div className={classes.footerWrapper}>
                <div>
                    <p className={classes.footerText}>{strings.footerLabel}</p>
                </div>
            </div>    
        )
    }

    render() {
        const { classes } = this.props;
        const {isOpen} = this.state
        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={isOpen}
            >
                <div style={modalContent} className={classes.paper}>
                    <div>
                        <div className={classes.headerIconContainer}>
                            <HeaderIcon className={classes.headerIcon}/>
                        </div>
                        <p className={classes.mainText}>
                            {strings.headerLabel}
                        </p>
                        {this.renderInfoCollector()}
                        {this.renderColorPicker()}
                        <div className={classes.buttonContainer}>                        
                            <Button 
                                onClick={() => this.submitInfo()}
                                disabled={this.state.isLoading}
                                variant="contained" 
                                size="large" 
                                color="primary" 
                                className={classes.button}
                            >
                                {strings.buttonLabel}
                            </Button>
                        </div>
                        {this.renderAuthFooter()}
                    </div>                               
                </div>
            </Modal>
        )
    }
}

const modalContent = {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
}

const useStyles = theme => ({
    textField: {
        fontSize: '15px'
    },
    headerIconContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    headerIcon: {
        width: 50,
        height: 50,
        marginBottom: 24,
        color: keys.APP_COLOR
    },
    mainText: {
        textAlign: "center",
        fontSize: 20,
        margin: 0
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    paper: {
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(6),
        borderRadius: 5,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
            width: 500,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(6),
            borderRadius: 5,
            outline: 'none',
		},
		
    },
    colorPickerContainer: {
        marginTop: 32  
    },
    button: {
        '&:focus': {
            outline: 'none'
        },
        color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(4),
        fontSize: '13px',
        width: '40%',        
    },
    footerWrapper: {
        display: 'flex',
        justifyContent: 'center',
        // marginTop: theme.spacing(4)
    },
    footerText: {
        textAlign: 'center',
        color: keys.APP_COLOR_GRAY_DARKEST,
        fontWeight: 300,
        margin: 0,
        marginTop: 32
    },
    buttonIconWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        '&:focus': {
            outline: 'none'
        }
    },
    buttonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    }
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, getUserResolveAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(OnboardingModal));