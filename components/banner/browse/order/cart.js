import React, {Fragment} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import Preview from './card-preview'
import {showToastAction} from '../../../../redux/actions';

//A pop up to ask users to login or signup
class CartModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            count: 1,
            isLoading: false
        }
    }

    orderBanners() {
        let { setState, state } = this.props;
        let orders = {...state.orders}
        const params = { orders }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/create-banner-orders', params)
        .then(() => {
            this.setState({isLoading:false})
            callback()
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't send validation email. Please try again later.`, 'error')
            this.setState({isLoading:false})
            setState({orders: {}, previewOrders: false})
        })

        setState({previewOrders: false})
    }

    incrementCount(order, key, count) {
        if (count < 1) return
        order = {...order}
        order.count = Number(count)
        let orders = {...this.props.state.orders}
        orders[key] = order
        this.props.setState({orders})
    }

    render() {
        const { classes, state, setState } = this.props;
        const { previewOrders, orders } = state

        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={previewOrders ? true : false}
                onClose={() => {
                    setState({previewOrders: false})
                }}
            >
                <div className={classes.paper}>
                    <div className={classes.previewContainer}>
                        {Object.keys(orders).map(key => {
                            const order = orders[key]
                            return (
                                <div style={{margin: '0px 20px'}}>
                                    <Preview
                                        state={state} 
                                        setState={setState} 
                                        banner={order.banner}
                                        count={order.count}
                                        setCount={count => this.incrementCount(order, key, count)}
                                    />
                                </div>
                            )
                        })}
                        <br/>
                    </div>
                    <div className={classes.buttonContainer}>          
                        <Button 
                            disabled={this.state.isLoading}
                            onClick={() => this.orderBanners()} 
                            variant="contained" 
                            size="large" 
                            color="primary"
                            style={{color: 'white'}}
                            className={classes.button}
                        >
                                Order Now
                        </Button>
                        <Button 
                            onClick={() => setState({orders: {}, previewOrders: false})} 
                            variant="outlined" 
                            size="large" 
                            color="primary" 
                            className={classes.button}
                        >
                                RESET
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    paper: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        width: 'auto',
        maxWidth: '90%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(6),
        borderRadius: 5,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(6),
            borderRadius: 5,
            outline: 'none',
		},
		
    },
    previewContainer: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto',
    },
    button: {
        '&:focus': {
            outline: 'none'
        },
        // color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(4),
        fontSize: '13px',
        width: 200,        
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CartModal));