import React from 'react';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import keys from '../../config/keys'

class TopBar extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderMainButton(mainButtonText, mainButtonAction) {
        const {classes} = this.props
        
        if (!mainButtonText) return null
        return (
            <Button 
                onClick={mainButtonAction}
                size="small"                        
                variant="outlined" color="primary"
                className={classes.headerMainButton}
            >{mainButtonText}</Button>    
        )
    }
    
    renderSubtext() {
        const {classes, subtext} = this.props
        if (subtext) {
            return <p className={classes.subtext}>{subtext}</p>
        }
    }
    
    renderBackButton() {
        const {classes, action} = this.props
        if (action) {
            return (
                <div className={clsx(classes.subBar, classes.pageHeader)}>
                    <Button className={classes.backButton} onClick={action}>
                        <i className="fas fa-chevron-left"></i><span className={classes.buttonText}>BACK</span>
                    </Button>
                </div>
            )
        }
    }

    render() {
        const {classes, title, mainButtonText, mainButtonAction} = this.props
        if (this.props.modal) return null

        return (
            <div className={classes.headerContainer}>
                <div className={classes.pageHeader}>
                    <div>
                    <span className={classes.headerMainWrapper}>
                        <p className={classes.headerText}>
                            {title}
                        </p>
                        {this.renderMainButton(mainButtonText, mainButtonAction)}
                    </span>
                    {this.renderSubtext()}
                    </div>
                </div>
                {this.renderBackButton()}
            </div>
        );
    }
}

const useStyles = theme => ({
   headerContainer: {
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1000
    },
    subBar: {
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(21,27,38,.15)',
        display: 'flex',
        alignItems: 'center',
        height: 40
    },
    backButton: {
        // marginLeft: 30  
    },
    buttonText: {
        fontSize: 13
        // marginLeft: 10
    },
    headerMainWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    pageHeader: {
        width: '100%',
        height: 48,
        backgroundColor: 'white',
        // boxShadow: '0 1px 3px 0 rgba(21,27,38,.15)',
        borderBottom: `1px solid ${keys.APP_COLOR_GRAY}`,
        display: 'flex',
        alignItems: 'center',
        padding: '3px 30px'
    },
    headerMainButton: {
        height: '30px',
        fontSize: '13px',    
        marginRight: theme.spacing(2)
    },
    headerText: {
        margin: 0,
        fontSize: 17,
        fontWeight: 400
    },
    subtext: {
        margin: '10px 0px 0px 0px',
        color: keys.APP_COLOR,
        fontSize: 15
    }
});

export default withStyles(useStyles)(TopBar)