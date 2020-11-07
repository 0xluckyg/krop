import React from 'react';

import { withStyles } from '@material-ui/core/styles';

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
    
    renderCards() {
        const {duplicate, edit, state, setState, admin} = this.props
        return <React.Fragment>
            {this.props.state.widgets.map(widget => {
                loadFonts(document, widget.fonts)
                return (
                    <Card 
                        admin={admin}
                        key={widget._id}
                        delete={this.props.delete} 
                        edit={edit} 
                        duplicate={duplicate} 
                        state={state} 
                        setState={setState} 
                        widget={widget}
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
    }
});

export default withStyles(useStyles)(List)