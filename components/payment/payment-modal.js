import React from 'react';
import axios from 'axios'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { withStyles } from '@material-ui/core/styles';
import { Divider, Modal, Button } from '@material-ui/core';

import {
    showToastAction, 
    isLoadingAction, 
    getUserAction, 
    showPaymentPlanAction} 
from '../../redux/actions';
import {handleStripePayment}  from './stripe-checkout'
import * as keys from '../../config/keys';

//A pop up to show subscription plans
class PaymentPlanModal extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            isLoading: false,
        }
    }

    handleShopifySubscription(plan) {
        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/handle-shopify-subscription', {
            params: { plan }
        })
        .then(res => {
            const redirectUrl = res.data
            if (redirectUrl == 'canceled subscription') {
                this.props.getUserAction()
                this.props.showToastAction(true, "Subscription canceled.")
                this.setState({isLoading: false})
                this.props.showPaymentPlanAction(false)
                return
            }
            window.location.replace(redirectUrl);
            this.setState({isLoading: false})
        }).catch(err => {
            this.props.showToastAction(true, "Couldn't subscribe. Please Try Again Later.")
            this.setState({isLoading: false})
            return err
        })    
    }
    
    async handleStripeSubscription(plan) {
        this.setState({isLoading: true})
        await handleStripePayment(plan, () => {
            this.setState({isLoading: false})
        })
        this.props.getUserAction()
        this.setState({isLoading: false})
        this.props.showToastAction(true, "Subscription successfully changed!")
    }

    async changeSubscriptionRequest(plan) {
        const user = this.props.getUserReducer
        if (!user || !user.type) return
        
        if (user.type == 'shopify') {
            this.handleShopifySubscription(plan)
        } else if (user.type == 'organic') {
            await this.handleStripeSubscription(plan)
        }
    }
    
    showNeedsUpgradeHeader() {
        const { classes } = this.props;
        if (!this.props.showPaymentPlanReducer.text) return <div></div>
        return (
                <p className={classes.upgradeNoteTextStyle}>{this.props.showPaymentPlanReducer.text}</p>
        )
    }
    
    renderPaymentCard(plan, planPricing, options) {
        const { classes } = this.props;
        let payment = this.props.getUserReducer.payment

        let cardStyle = classes.paymentCardStyle
        let buttonText = 'Try'
        if (payment && planPricing < payment.plan) buttonText = 'Downgrade'
        let selected =  (payment && planPricing == payment.plan)
        if (payment && payment.plan == planPricing) {
            cardStyle = classes.paymentCardSelectedStyle
            buttonText = 'Current Plan'
        }

        return (
            <div className={cardStyle}>
                <div>
                    <p className={classes.planNameStyle}>{plan}</p>
                    <h1 className={classes.planPricingStyle}>${planPricing}</h1>
                    <p className={classes.planPricingSubtextStyle}>per month</p>
                </div>
                
                <Divider className={classes.dividerStyle}/>
                
                <div className={classes.planOptionsContainerStyle}>
                    {options}
                 </div>
                 
                 <div className={classes.planButtonContainerStyle}>
                    <Button 
                        onClick={async () => await this.changeSubscriptionRequest(planPricing)}  
                        variant="contained" 
                        size="large" 
                        color="primary" 
                        className={classes.button}
                        disabled={selected || this.state.isLoading} 
                    >
                        {buttonText}
                    </Button>
                 </div>
            </div>
        )
    }

    render() {
        const { classes, showPaymentPlanReducer, showPaymentPlanAction } = this.props;
        const modalOpen = showPaymentPlanReducer.show ? true : false
        return(
            <Modal 
                open={modalOpen} 
                onClose={() => showPaymentPlanAction(false)}
            >
                <div className={classes.modalContentStyle}>
                    {this.showNeedsUpgradeHeader()}
                    <div className={classes.cardsWrapperStyle}>
                        {
                            this.renderPaymentCard("FREE", keys.FEE_0.price, 
                            <ul className={classes.planOptionsListStyle}>
                                <li className={classes.planOptionsTextStyle}><b>{keys.FEE_0.views}</b> visitors per month</li>
                                <li className={classes.planOptionsTextStyle}>Branded</li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of domains</li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of popups</li>
                                <li className={classes.planOptionsTextStyle}><b>Manage users</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Chat & Email</b> support</li>
                            </ul>)
                        }
                        {
                            this.renderPaymentCard("PRO", keys.FEE_1.price, 
                            <ul className={classes.planOptionsListStyle}>
                                <li className={classes.planOptionsTextStyle}><b>{keys.FEE_1.views}</b> visitors per month</li>
                                <li className={classes.planOptionsTextStyle}><b>Unbranded</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of domains</li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of popups</li>
                                <li className={classes.planOptionsTextStyle}><b>Manage users</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Chat & Email</b> support</li>
                            </ul>)
                        }
                        {
                            this.renderPaymentCard("PREMIUM", keys.FEE_2.price, 
                            <ul className={classes.planOptionsListStyle}>
                                <li className={classes.planOptionsTextStyle}><b>{keys.FEE_2.views}</b> visitors per month</li>
                                <li className={classes.planOptionsTextStyle}><b>Unbranded</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of domains</li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of popups</li>
                                <li className={classes.planOptionsTextStyle}><b>Manage users</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Chat & Email</b> support</li>
                            </ul>)
                        }
                        {
                            this.renderPaymentCard("ENTERPRISE", keys.FEE_3.price, 
                            <ul className={classes.planOptionsListStyle}>
                                <li className={classes.planOptionsTextStyle}><b>+{keys.FEE_3.views}</b> visitors per month</li>
                                <li className={classes.planOptionsTextStyle}><b>Unbranded</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of domains</li>
                                <li className={classes.planOptionsTextStyle}><b>Unlimited</b> number of popups</li>
                                <li className={classes.planOptionsTextStyle}><b>Manage users</b></li>
                                <li className={classes.planOptionsTextStyle}><b>Chat & Email</b> support</li>
                            </ul>)
                        }
                    </div>
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    modalContentStyle: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'transparent',
        boxShadow: theme.shadows[5],
        outline: 'none',
        overflowX: 'auto',
        width: '90%',
        borderRadius: 10,
        
        overflowY: 'auto',
        height: '100%',
        display: 'block',
        [theme.breakpoints.up('md')]: {
            overflowY: 'auto',
            height: 'auto',
		},
    },
    cardsWrapperStyle: {
        position: 'relative',
        display: 'block',
        [theme.breakpoints.up('md')]: {
			display: 'flex',
		},
    },
    upgradeNoteTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        padding: theme.spacing(2),
        margin: 0,
        color: 'white',
        backgroundColor: keys.APP_COLOR
    },
    paymentCardStyle: {
        padding: theme.spacing(8),
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.paper
    },
    paymentCardSelectedStyle: {
        padding: theme.spacing(8),
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#d1d1d1'
    },
    planNameStyle: {
        textAlign: "center",
        fontSize: 25,
        marginBottom: theme.spacing(1),
        marginTop: 0
    },
    planPricingStyle: {
        textAlign: "center",
        fontSize: 35,    
        marginBottom: theme.spacing(1),
        marginTop: 0
    },
    planPricingSubtextStyle: {
        textAlign: "center",
        fontSize: 8,
        marginBottom: theme.spacing(1),
        marginTop: 0,
    },
    planOptionsContainerStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    planOptionsListStyle: {
        listStyle:'none',
        padding: 0,
        marginBottom: theme.spacing(2)
    },
    planOptionsTextStyle: {
        textAlign: "center",
        marginBottom: theme.spacing(1),
        marginTop: 0,
        fontSize: 14
    },
    planButtonStyle: {
        padding: theme.spacing(3)
    },
    planButtonContainerStyle: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    dividerStyle: {
        margin: theme.spacing(2),
        height: theme.spacing(0.3),
        color: '#fff'
    }
});

function mapStateToProps({getUserReducer, showPaymentPlanReducer}) {
    return {getUserReducer, showPaymentPlanReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction, getUserAction, showPaymentPlanAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(PaymentPlanModal));