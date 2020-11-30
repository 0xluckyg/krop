import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import PhoneIcon from '@material-ui/icons/PhoneIphone';
import DesktopIcon from '@material-ui/icons/DesktopMac';

import keys from '../../../../../config/keys'
import {elementsToPages} from '../../element-editor/sub/functions'
class PageController extends React.Component {
    constructor(props) {
        super(props)
    }
    
    togglePage(direction) {
        const {selectedPage} = this.props.state
        const toPage = selectedPage + direction
        // console.log()
        this.props.setState({selectedPage: toPage})   
    }
    
    hasBefore() {
        const {selectedPage} = this.props.state
        return (selectedPage > 0)
    }
    
    hasAfter() {
        const {state} = this.props
        const {selectedStage, selectedPage} = state
        const elements = state.stages[selectedStage].elements
        const pages = elementsToPages(elements)
        return (selectedPage < pages.length - 1)
    }
    
    renderPageController() {
        const {classes, state} = this.props
        const {selectedStage} = state
        const {questionPerPage} = state.stages[selectedStage].settings
        if (!questionPerPage) return null
        return (
            <React.Fragment>
                <IconButton  
                    onClick={() => this.togglePage(-1)}
                    className={clsx(classes.button)} 
                    variant="contained"
                    disabled={!this.hasBefore()}
                >
                    <LeftIcon fontSize="small" />
                </IconButton>
                <IconButton  
                    onClick={() => this.togglePage(1)}
                    className={clsx(classes.button)} 
                    variant="contained"
                    disabled={!this.hasAfter()}
                >
                    <RightIcon fontSize="small" />
                </IconButton>
            </React.Fragment>    
        )
    }

    render() {
        const {classes, state, setState} = this.props
        
        return (
            <div className={classes.controllerContainer}>
                {this.renderPageController()}
                <IconButton  
                    className={clsx(classes.button, state.viewMode == keys.MOBILE_PROPERTY ? classes.selectedButton : null)} 
                    onClick={() => setState({viewMode: keys.MOBILE_PROPERTY})} 
                    variant="contained">
                    <PhoneIcon fontSize="small" />
                </IconButton>
                <IconButton  
                    className={clsx(classes.button, state.viewMode == keys.DESKTOP_PROPERTY ? classes.selectedButton : null)} 
                    onClick={() => setState({viewMode: keys.DESKTOP_PROPERTY})} 
                    variant="contained">
                    <DesktopIcon fontSize="small" />
                </IconButton>
            </div>
        )
    }
}

const useStyles = theme => ({
    controllerContainer: {
        position: 'absolute',
        // width: 220,
        // height: 40,
        bottom: 15,
        right: 30,
        display: 'flex',
        justifyContent: 'space-between'
    },
    button: {
        width: 40,
        height: 40,
        margin: '0px 10px',
        backgroundColor: keys.APP_COLOR_GRAY_DARK,
        zIndex: 999,
        color: 'white',
        '&:hover': {
            backgroundColor: '#9a9a9a'
        }
    },
    selectedButton: {
        backgroundColor: '#9a9a9a'
    }
})

export default withStyles(useStyles)(PageController)