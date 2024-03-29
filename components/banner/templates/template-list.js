import React from 'react';
import clsx from 'clsx'
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';

import CompiledElement from './element-preview'
import keys from '../../../config/keys'
import Spinner from '../../reusable/spinner';
import NoContent from '../../reusable/no-content';

class List extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderNoContent() {        
        return (
            <NoContent
                iconPath="../../../static/campaign/edit-tools.svg"
                text='Hey there,'
                subText="It looks like there isn't any template matching your search!"
                actionText='Reset Search'
                footerText="We're constantly designing new contents, so keep updated!"
                action={() => {
                    this.props.setState({searchText: ''})
                    this.props.fetchTemplates({page: 1})
                }}
            />
        )
    }
    
    renderCards() {
        const {state, setState, category, handleScroll} = this.props
        const {templates} = state
        return <category.render
                    handleScroll={handleScroll}
                    state={state}
                    setState={setState}
                    templates={templates}
                    category={category}
                />
    }
    
    render() {
        const {classes, state} = this.props
        const {isLoading, templates} = state

        if (isLoading) {
            return <div className={classes.emptyContainer}>
                <Spinner/>
            </div>
        } else if (templates.length <= 0) {
            return <div className={classes.emptyContainer}>
                {this.renderNoContent()}
            </div>
        }
        
        return (
            this.renderCards()
        );
    }
}

const useStyles = theme => ({
    emptyContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        height: '100%',
        width: '100%',
        padding: 30,
        // display: 'grid',
        // gridGap: '10px',
        // gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        // gridAutoRows: 'minmax(50px, auto)',
        // justifyItems: 'center'
    },
});

export default withStyles(useStyles)(List)