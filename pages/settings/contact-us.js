import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const emailValidator = require("email-validator");
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import PageHeader from '../../components/reusable/page-header'
import Spinner from '../../components/reusable/spinner';
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    en:{
        subjectError: "Please enter more than 3 characters",
        bodyError: "Please enter more than 10 characers",
        emailError: "Please enter a valid email",
        sentAlert: "Email sent!",
        sendError: "We're having trouble sending your email. Please try again later",
        contactUsTitle: "CONTACT US",
        subjectLabel: "Subject",
        subjectPlaceholder: "E.g. Save button is not working!",
        emailLabel: "Email",
        emailPlaceholder: "E.g. youremail@example.com",
        bodyLabel: "Body",
        bodyPlaceholder: 'Any technical issues? &#10;Any feedback? &#10;Want to get in touch? &#10;Please fill out the form and shoot us an email!',
        buttonLabel: "Send email"
    },
    kr: {
        subjectError: "제목을 3자리 이상 써주세요",
        bodyError: "본문을 10자리 이상 써주세요",
        emailError: "올바른 이메일을 적어주세요",
        sentAlert: "이메일을 보냈어요!",
        sendError: "이메일을 보내지 못했어요. 잠시후 다시 시도해 주세요",
        contactUsTitle: "연락",
        subjectLabel: "주제",
        subjectPlaceholder: "예시: 저장 버튼이 안먹혀요!",
        emailLabel: "이메일",
        emailPlaceholder: "예시: abc@krop.app",
        bodyLabel: "본문",
        bodyPlaceholder: '저희와 소통해요!',
        buttonLabel: "보내기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class ContactUs extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            subjectValue: "",
            emailValue: "",
            bodyValue: "",
            subjectError: "",
            emailError: "",
            bodyError: "",
            isLoading: false
        }

        this.submitEmail = this.submitEmail.bind(this); 
        this.validator = this.validator.bind(this);       
    }

    componentDidMount() {        
        this.props.isLoadingAction(false)            
    }

    //Simple checks from the clientside before sending info to the server
    validator() {
        let valid = true
        if (this.state.subjectValue.length < 3) {
            this.setState({subjectError: strings.subjectError})            
            valid = false
        } else {
            this.setState({subjectError:""})                        
        }   

        if (this.state.bodyValue.length < 10) {
            this.setState({bodyError: strings.bodyError})
            valid = false
        } else {
            this.setState({bodyError:""})
        }

        if (!emailValidator.validate(this.state.emailValue)) {
            this.setState({emailError: strings.emailError})            
            valid = false
        } else {
            this.setState({emailError:""})
        }

        return valid
    }
    
    submitEmail() {
        if (this.validator()) {
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
            const emailContent = {
                subject: this.state.subjectValue,
                email: this.state.emailValue,
                body: this.state.bodyValue
            }
            this.setState({isLoading: true})
            axios.post(process.env.APP_URL + '/contact-us', emailContent, headers)
            .then(res => {
                this.props.showToastAction(true, strings.sentAlert)
                this.setState({
                    subjectValue: "",
                    emailValue: "",
                    bodyValue: "",
                    subjectError: "",
                    emailError: "",
                    bodyError: "",
                    isLoading: false
                })
            }).catch(err => {
                this.props.showToastAction(true, strings.sendError, 'error')
                this.setState({isLoading: false})
                return err
            })
        }
    }

    render() {
        const {classes} = this.props
        const {subjectValue, emailValue, bodyValue, subjectError, emailError, bodyError} = this.state

        return (           
            <main className={classes.content}>
            <PageHeader title={strings.contactUsTitle}paddingTop/>
            <Container maxWidth={keys.CONTAINER_SIZE}>
                <Paper className={classes.paper}>                                    
                    <TextField
                        id="subject"
                        label={subjectError ? subjectError : strings.subjectLabel}                        
                        value={subjectValue}
                        onChange={(event) => {
                            this.setState({subjectValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder={strings.subjectPlaceholder}
                        error={subjectError ? true : false}
                        fullWidth
                    />
                    <TextField
                        id="email"
                        label={emailError ? emailError : strings.emailLabel}                        
                        value={emailValue}
                        onChange={(event) => {                            
                            this.setState({emailValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder={strings.emailPlaceholder}
                        error={emailError ? true : false}
                        fullWidth
                    />                    
                    <TextField
                        id="body"
                        label={bodyError ? bodyError : strings.bodyLabel}
                        multiline                        
                        value={bodyValue}
                        onChange={(event) => {                            
                            this.setState({bodyValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder={strings.bodyPlaceholder}
                        error={bodyError ? true : false}
                        fullWidth
                    />
                    <div className={classes.buttonWrapper}>
                        <Button 
                            onClick={this.submitEmail}
                            size="large"
                            variant="contained" 
                            color="primary" 
                            className={classes.button}     
                            disabled={this.state.isLoading}                       
                        >
                            {strings.buttonLabel}
                        </Button>
                    </div>                    
                </Paper>                         
            </Container>
            </main>
        )
    }
}

const useStyles = theme => ({   
    content: {
        flexGrow: 1,
        paddingBottom: theme.spacing(3),
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    paper: {
        padding: theme.spacing(3, 5),
        marginTop: theme.spacing(4)
    },    
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        color: 'white',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        fontSize: '13px',                
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(ContactUs));