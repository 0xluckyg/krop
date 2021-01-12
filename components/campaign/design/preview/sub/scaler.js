import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../../config/keys'

class Scaler extends React.Component {
    constructor(props) {
        super(props)
    }
    
    handleScaleLimit(scale) {
        return !(scale < 0.1 || scale > 2.6)
    }
    
    render() {
        const {classes, state, setState} = this.props
        let scale = state.previewScale
        
        return (
            <div className={classes.scalerContainer}>
                <div 
                    className={classes.scaleButton}
                    onClick={() => {
                        const newScale = scale - 0.1
                        if (!this.handleScaleLimit(newScale)) return
                        setState({previewScale: newScale})
                    }}
                >
                    -
                </div>
                <div className={classes.scaleText}>
                    {Math.round(scale * 100)}%
                </div>
                <div 
                    className={classes.scaleButton}
                    onClick={() => {
                        const newScale = scale + 0.1
                        if (!this.handleScaleLimit(newScale)) return
                        setState({previewScale: newScale})
                    }}    
                >
                    +
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({
    scalerContainer: {
        zIndex: 999,
        position: 'absolute',
        top: 30,
        right: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        width: 100,
        height: 30,
        backgroundColor: keys.APP_COLOR_GRAY_DARK,
        color: 'white',
        paddingRight: 2.5,
        paddingLeft: 2.5,
        borderRadius: 15
    },
    scaleButton: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
        cursor: 'pointer',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: '0.3s',
        backgroundColor: '#9a9a9a',
        userSelect: 'none',
        '&:hover': {
            transition: '0.3s',
            backgroundColor: keys.APP_COLOR_GRAY_DARKEST
        }
    },
    scaleText: {
        
    }
})

export default withStyles(useStyles)(Scaler)