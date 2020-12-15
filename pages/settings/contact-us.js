import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const emailValidator = require("email-validator");

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import PageHeader from '../../components/reusable/page-header'
import Spinner from '../../components/reusable/spinner';
import keys from '../../config/keys'

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
            this.setState({subjectError:"Please enter more than 3 characters"})            
            valid = false
        } else {
            this.setState({subjectError:""})                        
        }   

        if (this.state.bodyValue.length < 10) {
            this.setState({bodyError:"Please enter more than 10 characters"})
            valid = false
        } else {
            this.setState({bodyError:""})
        }

        if (!emailValidator.validate(this.state.emailValue)) {
            this.setState({emailError:"Please enter a valid email address"})            
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
                this.props.showToastAction(true, 'Email Sent!')
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
                this.props.showToastAction(true, 'Having Trouble.. Please Try Again Later ):', 'error')
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
            <PageHeader title='CONTACT US' paddingTop/>
            <Container maxWidth={keys.CONTAINER_SIZE}>
                <Paper className={classes.paper}>                                    
                    <TextField
                        id="subject"
                        label={subjectError ? subjectError : "Subject"}                        
                        value={subjectValue}
                        onChange={(event) => {
                            this.setState({subjectValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder="e.g. Save button not working!"
                        error={subjectError ? true : false}
                        fullWidth
                    />
                    <TextField
                        id="email"
                        label={emailError ? emailError : "Email"}                        
                        value={emailValue}
                        onChange={(event) => {                            
                            this.setState({emailValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder="e.g. youremail@example.com"
                        error={emailError ? true : false}
                        fullWidth
                    />                    
                    <TextField
                        id="body"
                        label={bodyError ? bodyError : "Body"}
                        multiline                        
                        value={bodyValue}
                        onChange={(event) => {                            
                            this.setState({bodyValue:event.target.value})
                        }}
                        margin="normal"
                        placeholder='Any technical issues? &#10;Any feedback? &#10;Want to get in touch? &#10;Please fill out the form and shoot us an email!'
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
                            Send Email
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