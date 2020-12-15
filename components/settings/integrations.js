import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

import {getUserAction, getUserResolveAction, showToastAction, isLoadingAction } from '../../redux/actions';
import keys from '../../config/keys'

const apiKeyHelp = {
    mailchimp: 'https://mailchimp.com/help/about-api-keys/',
    klaviyo: 'https://help.klaviyo.com/hc/en-us/articles/115005062267-Manage-Your-Account-s-API-Keys',
    hubspot: 'https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key'
}

const apiKeyGet = {
    mailchimp: 'https://us18.admin.mailchimp.com/account/api/',
    klaviyo:  'https://www.klaviyo.com/account#api-keys-tab',
    hubspot: 'https://app.hubspot.com/api-key/7989792/call-log'
}

class ChangePassword extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            apiKey: '',
            apiKeyError: '',
            selectedIntegration: null
        }
    }
    
    getCapitalizedBrandName(brand) {
        if (!brand) return null
        return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
    
    renderBrandCard(brand) {
        const {classes} = this.props
        const {integrations} = this.props.getUserReducer

        let color
        let logo
        let border
        let width = 50
        let integrated = (integrations && integrations[brand]) ? true : false
        switch(brand) {
            case('mailchimp'):
                color = '#ffe01a'
                logo = '../static/settings/mailchimp.png'
                break
            case('klaviyo'):
                color = '#fff'
                logo = '../static/settings/klaviyo.png'
                border = `1px solid ${keys.APP_COLOR_GRAY}`
                break
            case('hubspot'):
                color = '#ff7a5a'
                logo = '../static/settings/hubspot.svg'
                width = 90
                break
        }
        
        let subtextColor = integrated ? keys.APP_COLOR : keys.APP_COLOR_GRAY_DARK
        return (
            <div onClick={() => this.setState({selectedIntegration: brand})}>
                <div style={{
                    backgroundColor: color,
                    border
                }} className={classes.brandWrapper}>
                    <img className={classes.brand} style={{width}} src={logo}/>
                </div>
                <span className={classes.brandMaintext}>{this.getCapitalizedBrandName(brand)}</span><br/>
                <span style={{color: subtextColor}} className={classes.brandSubtext}>{integrated ? 'Integrated' : 'Unintegrated'}</span>
            </div>
        )
    }
    
    handleIntegration() {
        let {selectedIntegration, apiKey} = this.state
        if (apiKey == '') apiKey = null
        const params = {
            brand: selectedIntegration,
            apiKey
        }
        axios.post(process.env.APP_URL + '/set-third-party-api-key', params).then(res => {
            const newUser = res.data
            this.setState({selectedIntegration: null, apiKey: '', apiKeyError: ''})
            this.props.getUserResolveAction(newUser)
        }).catch(() => {
            this.setState({apiKeyError: 'Please enter a valid API Key'})
            this.props.showToastAction(true, 'Please enter a valid API Key.', 'error')
        })
    }
    
    handleDisintegration() {
        const {selectedIntegration} = this.state
        const params = {
            brand: selectedIntegration,
            apiKey: null
        }
        axios.post(process.env.APP_URL + '/set-third-party-api-key', params).then(res => {
            const newUser = res.data
            this.setState({apiKey: '', apiKeyError: ''})
            this.props.getUserResolveAction(newUser)
        }).catch(() => {
            this.setState({apiKeyError: 'Please enter a valid API Key'})
            this.props.showToastAction(true, 'Please enter a valid API Key.', 'error')
        })
    }
    
    renderApiKeyModal() {
        const {classes} = this.props
        const {integrations} = this.props.getUserReducer
        const {apiKey, apiKeyError, selectedIntegration} = this.state
        
        const integrated = (integrations && integrations[selectedIntegration]) ? true : false

        return (
            <Modal 
                open={selectedIntegration ? true : false}
                onClose={() => this.setState({selectedIntegration: null})}
            >
                <div className={classes.modalStyle}>
                    <span className={classes.modalMainText}>{selectedIntegration + " integration"}</span><br/>
                    {integrated ? null : 
                    <TextField
                        className={classes.modalTextField}
                        id="API Key"
                        label="API Secret Key"
                        value={apiKey}
                        onChange={(event) => {
                            this.setState({apiKey:event.target.value})
                        }}
                        margin="normal"
                        placeholder="API Secret Key"
                        error={apiKeyError ? true : false}
                        helperText={apiKeyError ? apiKeyError : false}
                        fullWidth
                        autoFocus
                    /> 
                    }
                    <p 
                        onClick={() => window.open(apiKeyHelp[selectedIntegration], '_blank')} 
                        className={classes.integrationSetupText}>
                        Where do I find my {this.getCapitalizedBrandName(selectedIntegration)} API Key?
                    </p>
                    <p 
                        onClick={() => window.open(apiKeyGet[selectedIntegration], '_blank')} 
                        className={classes.integrationSetupText}>
                        Get my {this.getCapitalizedBrandName(selectedIntegration)} API Key
                    </p>
                    <div>
                        <div className={classes.modalButtonContainer}>                        
                            <Button 
                                onClick={() => {
                                    integrated ? this.handleDisintegration() : this.handleIntegration()
                                }} 
                                variant="contained" 
                                size="large" 
                                color="primary" 
                                className={classes.modalButton}
                            >
                                    {integrated ? 'DISINTEGRATE' : 'SUBMIT'}
                            </Button>
                        </div>
                    </div>                               
                </div>
            </Modal>
        )   
    }
    
    render() {
        const {classes} = this.props          
        
        return (
            <Paper className={classes.paper}>
                {this.renderApiKeyModal()}
                <Typography variant="subtitle2" gutterBottom>
                    Integrate With 3rd Parties
                </Typography><br/>
                <div className={classes.brandsWrapper}>
                    {this.renderBrandCard('mailchimp')}
                    {this.renderBrandCard('klaviyo')}
                    {this.renderBrandCard('hubspot')}
                </div>
            </Paper>  
        )
    }
}

const useStyles = theme => ({   
    modalStyle: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(6),
        borderRadius: 5,
        outline: 'none',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`
    },
    paper: {
        padding: theme.spacing(3, 5),
        display: 'flex',
        flexDirection: 'column'
    },    
    brandsWrapper: {
        display: 'flex',
        flexDirection: 'row'
    },
    brandWrapper: {       
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 7,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        transition: '0.2s',
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.7,
            transition: '0.2s'
        }
    },
    brand: {
        userDrag: 'none',
        userSelect: 'none'
    },
    brandMaintext: {
        fontSize: 13,
        marginLeft: 3,
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    brandSubtext: {
        fontSize: 13,
        marginLeft: 3
    },
    
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    modalMainText: {
        fontSize: 16,
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    modalTextField: {
        fontSize: '15px'
    },
    modalButton: {
        color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(3),
        fontSize: '13px',
        width: '40%',        
    },
    integrationSetupText: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        fontSize: 12,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
            transition: '0.2s',
            color: keys.APP_COLOR
        }
    }
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, getUserResolveAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ChangePassword));