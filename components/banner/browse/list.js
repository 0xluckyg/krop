import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';

import Card from './card'
import {loadFonts} from '../../reusable/font-families'

class List extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const {state} = this.props
        const {hasNext, page} = state
        if (bottom && hasNext) {
            this.props.fetch(page + 1)
        }
    }
    
    orderCard() {
        const {classes, state, setState} = this.props
        const {orders} = state

        const ordersLength = Object.keys(orders).length

        return <div onClick={() => {
            console.log("OOO: ", ordersLength)
            if (ordersLength > 0) {
                setState({previewOrders: true})
            }
        }} className={classes.card}>
            <div className={classes.cardWrapper}>
                <div className={classes.iconContainer}>
                    <AddShoppingCartIcon className={classes.mainIcon} fontSize="large" />
                </div>
                {ordersLength > 0 ? 
                    <p>{ordersLength} banners in cart. Click to order!</p> : 
                    <p>Please select banners to order!</p>
                }
            </div>
        </div>
    }

    createCard() {
        const {classes} = this.props
        return <div onClick={() => {
            window.location.replace(`${process.env.APP_URL}/banners/create`)
        }} className={classes.card}>
            <div className={classes.cardWrapper}>
                <div className={classes.iconContainer}>
                    <AddCircleOutlineIcon className={classes.mainIcon} fontSize="large" />
                </div>
                <p>Create a new banner!</p>
            </div>
        </div>
    }

    renderCards() {
        const {duplicate, edit, state, setState} = this.props
        return <React.Fragment>
            {this.orderCard()}
            {this.createCard()}
            {this.props.state.banners.map(banner => {
                loadFonts(document, [...banner.fonts])
                return (
                    <Card 
                        key={banner._id}
                        delete={this.props.delete} 
                        edit={edit} 
                        duplicate={duplicate} 
                        state={state} 
                        setState={setState} 
                        banner={{...banner}}
                    />
                )
            })}
        </React.Fragment>
    }
    
    render() {
        const {classes} = this.props

        return (
            <div onScroll={(e) => this.handleScroll(e)} className={classes.list}>
                {this.renderCards()}
            </div>
        );
    }
}

const useStyles = theme => ({
    list: {
        width: '100%',
        padding: 30,
        display: 'grid',
        gridTemplateColumns: 'repeat( auto-fill, minmax(300px, 1fr) )',
        gridGap: 30,
        justifyItems: 'center',
        overflowY: 'scroll'
    },
    card: {
        width: 300,
        height: 250,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
    },
    cardWrapper: {
        borderRadius: 8,
        transition: '0.2s',
        '&:hover': {
            opacity: 0.7,
            transition: '0.2s'
        }
    },
    iconContainer: {
        display:'flex',
        justifyContent: 'center'
    },
    button: {
        '&:focus': {
            outline: 'none'
        },
        color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(4),
        fontSize: '13px',
        width: 200,        
    }
});

export default withStyles(useStyles)(List)