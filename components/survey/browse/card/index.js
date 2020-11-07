import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopy from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

import { showToastAction, isLoadingAction } from '../../../../redux/actions';
import keys from '../../../../config/keys';
import CompiledPreview from '../../../reusable/compile-preview'

class Card extends React.Component {      
    constructor(props) {
        super(props)
        
        this.state = {
            isLoading: false
        }
    }
    
    handleEdit() {
        this.props.setState({
            isEditing: true,
            currentEdit: {...this.props.widget}
        })  
    }
    
    handleDelete() {
        this.props.delete(this.props.widget._id)
    }
    
    handleDuplicate() {
        this.props.duplicate(this.props.widget)
    }
    
    handleToggleActive() {
        const widget = {...this.props.widget}
        widget.enabled = !widget.enabled
        widget.compile = false
        this.props.edit(widget, () => {})
    }
    
    renderActiveStatus() {
        const {classes} = this.props
        const enabled = this.props.widget.enabled
        const color = enabled ? keys.APP_COLOR : keys.APP_COLOR_GRAY
        return (
            <div 
                style={{color}} 
                className={classes.activeStatus} 
                onClick={() => this.handleToggleActive()}
            >
                <CheckIcon className={classes.checkIcon}/>
                <span className={classes.activeText}>{enabled ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
        )
    }
    
    render() {
        const {classes, widget, admin} = this.props

        return (
            <div className={classes.card}>
                <div className={classes.cardPreview}>
                    <div className={classes.widgetView}>
                        <CompiledPreview widget={widget}/>
                    </div>
                    <div className={classes.cardHover}>
                        <div className={classes.iconButtons}>
                            <IconButton
                                className={classes.iconButton} 
                                onClick={() => this.handleDelete()}
                                size="small" variant="contained" color="primary">
                                <DeleteIcon className={classes.trashIcon}/>
                            </IconButton>
                            {admin ? null :<IconButton
                                className={classes.iconButton} 
                                onClick={() => this.handleDuplicate()}
                                size="small" variant="contained" color="primary">
                                <FileCopy className={classes.copyIcon}/>
                            </IconButton> }
                        </div>
                        {admin ? null :
                        <Button 
                            disabled={this.state.isLoading}
                            className={classes.editButton} 
                            startIcon={<EditIcon/>} 
                            variant="outlined"
                            onClick={this.handleEdit.bind(this)}
                        >
                            Edit
                        </Button> }
                        {this.renderActiveStatus()}
                    </div>
                </div>
                <div className={classes.cardFooter}>
                    <p className={classes.cardTitle}>
                        {widget.settings ? widget.settings.name : widget.name}
                    </p>
                    {admin ? null :<p className={classes.cardViews}>
                        <span className={classes.viewCount}>{widget.views}</span>
                        Views
                    </p> }
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    card: {
        width: 300,
        height: 250,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
    },
    cardPreview: {
        width: '100%',
        height: 190,
        backgroundColor: 'gray',
        borderRadius: '8px 8px 0px 0px',
        position: 'relative'
    },
    widgetView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '8px 8px 0px 0px',
    },
    cardHover: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        borderRadius: '8px 8px 0px 0px',
        transition: '200ms',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            transition: '200ms',
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,0.5)'
        }
    },
    iconButtons: {
        position: 'absolute',
        top: 12,
        right: 12
    },
    iconButton: {
        marginLeft: 5,
        color: 'white'
    },
    trashIcon: {
        width: 21,
        height: 21
    },
    copyIcon: {
        width: 18,
        height: 18,
    },
    editButton: {
        color: 'white',
        border: '2px solid white'
    },
    activeStatus: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
            transition: '0.2s',
            opacity: 0.7
        }
    },
    checkIcon: {
        width: 18,
        height: 18,
        marginRight: 3
    },
    activeText: {
        fontSize: 13
    },
    
    cardFooter: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderRadius: '0px 0px 8px 8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 20px 0px 20px'
    },
    cardTitle: {
        fontSize: 15,
        verticalAlign: 'middle'
    },
    cardViews: {
        fontSize: 15,
        verticalAlign: 'middle'
    },
    viewCount: {
        marginRight: 10,
        fontSize: 18
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Card));