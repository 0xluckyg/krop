import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { 
    mdiToggleSwitch,
    mdiToggleSwitchOffOutline
} from '@mdi/js';

import {getProperty, setProperty} from './functions'
import keys from '../../../../../config/keys'

class Switch extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getEnabled() {
        const {propertyType, property, state} = this.props
        const {selectedStage, selectedElement} = state
        return getProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property
        })
    }
    
    toggle() {
        const {propertyType, property, state} = this.props
        const {selectedStage, selectedElement} = state
        return setProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property,
            value: this.getEnabled() ? false : true
        })
    }
    
    render() {
        const {classes, title} = this.props
        const enabled = this.getEnabled()
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        
        return (
            <div className={classes.switchContainer}>
                <p className={classes.caption}>
                    {title}
                </p>
                <IconButton  
                    className={classes.iconButton} 
                    onClick={() => this.toggle()}
                    size="small" variant="contained" color="primary">
                    <Icon path={enabled ? mdiToggleSwitch : mdiToggleSwitchOffOutline}
                        size={0.9}
                        color={enabled ? selectedColor : notSelectedColor}
                    />
                </IconButton >
            </div>
        )
    }
}


const useStyles = theme => ({  
    switchContainer: {
        marginBottom: 8,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    caption: {
        margin: 0,
        color: 'rgba(0, 0, 0, 0.9)'
    }
})

export default withStyles(useStyles)(Switch)