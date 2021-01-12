import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
    
    createCard() {
        const {classes} = this.props
        return <div onClick={() => {
            window.location.replace(`${process.env.APP_URL}/campaigns/create`)
        }} className={classes.card}>
            <div className={classes.cardWrapper}>
                <div className={classes.iconContainer}>
                    <AddCircleOutlineIcon className={classes.mainIcon} fontSize="large" />
                </div>
                <p>Create a new campaign!</p>
            </div>
        </div>
    }

    renderCards() {
        const {duplicate, edit, state, setState, admin} = this.props
        return <React.Fragment>
            {this.createCard()}
            {this.props.state.campaigns.map(campaign => {
                loadFonts(document, [campaign.styles.font])
                return (
                    <Card 
                        admin={admin}
                        key={campaign._id}
                        delete={this.props.delete} 
                        edit={edit} 
                        duplicate={duplicate} 
                        state={state} 
                        setState={setState} 
                        campaign={campaign}
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
    }
});

export default withStyles(useStyles)(List)