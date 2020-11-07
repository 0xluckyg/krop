import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import keys from '../../config/keys'

class Footer extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderDiscardButton() {
        const {classes, discardAction, showDiscard, discardLabel} = this.props
        
        if (!showDiscard) return
        return (
            <Button className={classes.button} onClick={discardAction}
            size="small" variant="outlined" color="primary"
            disabled={this.props.isLoading}
            >
                {discardLabel}
            </Button>
        )
    }
    
    renderSaveButton() {
        const {classes, saveAction, showSave, saveLabel} = this.props
        
        if (!showSave) return
        return (
            <Button className={classes.saveButton} onClick={saveAction} 
            size="small" variant="contained" color="primary"
            disabled={this.props.isLoading}
            >
                {saveLabel}
            </Button>
        )
    }

    render() {
        const {classes, children} = this.props
        if (this.props.modal) return null

        return (
            <div className={classes.pageFooter}>
                {children}
                <div className={classes.buttonWrapper}>
                    {this.renderDiscardButton()}
                    {this.renderSaveButton()}
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    pageFooter: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderTop: `0.5px solid ${keys.APP_COLOR_GRAY_LIGHT}`,
        boxShadow: '0 1px 3px 0 rgba(21,27,38,.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonWrapper: {
        marginRight: 20,
        marginLeft: 20
    },
    button: {
        margin: '5px 10px'
    },
    saveButton: {
        margin: '5px 10px',
        color: 'white'
    }
});

export default withStyles(useStyles)(Footer)