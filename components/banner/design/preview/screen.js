import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import Scaler from './sub/scaler'

class Screen extends React.Component {
    constructor(props) {
        super(props)
        
        this.desktopRef = React.createRef()
        this.mobileRef = React.createRef()
    }

    mobile() {
        const {classes, children} = this.props
        return (
        <div className={classes.mobileFrame}>
            <div className={classes.mobileDevice}>
                <div className={classes.speaker}></div>
                <div ref={this.mobileRef} className={classes.screen}>
                    {children}
                </div>
            </div>
        </div>
        )
    }
    
    desktop() {
        const {classes, children} = this.props
        return (<div ref={this.desktopRef} className={classes.desktopFrame}>
            {children}
        </div>)
    }

    renderDevice() {
        if (this.props.state.viewMode == keys.DESKTOP_PROPERTY) {
            return this.desktop()   
        } else {
            return this.mobile()
        }
    }

    renderControllers() {
        const {classes, state, setState} = this.props
        if (state.cardMode) return null
        return <React.Fragment>
            <Scaler
                state={state}
                setState={setState}
            />
        </React.Fragment>
    }

    render() {
        const {classes, state, setState} = this.props
        return (
            <div className={classes.mainContainer}>
                {this.renderControllers()}
                {this.renderDevice()}
            </div>
        )
    }
}

const useStyles = theme => ({   
    mainContainer: {
        height: '100%',
        width:  '100%',
        position: 'relative'
    },
    mobileFrame: {
        height: '100%',
        width:  '100%',
        overflowY: props => {
            if (props.state.cardMode) return ''
            return 'auto'
        },
        // position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',

        backgroundColor: keys.APP_COLOR_GRAY_LIGHT
    },
    desktopFrame: props => {
        const scale = props.state.previewScale
        const isCardMode = props.state.cardMode
        return {
            transform: isCardMode ? `scale(${scale})` : '',
            transformOrigin: 'center',
            height: '100%',
            width:  '100%',
            // position: 'relative',
            flex: 1,
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT
        }
    },
    mobileDevice: props => {
        const scale = props.state.previewScale
        const isCardMode = props.state.cardMode
        return {
            margin: isCardMode ? -5 : 30,
            transform: `scale(${scale})`,
            transformOrigin: scale < 1 ? 'center 10%' : 'top center',
            height: 750,
            width: 363,
            padding: 10,
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            position: 'relative'
        }
    },
    speaker: {
        position: 'absolute',
        borderRadius: '0px 0px 10px 10px',
        width: 150,
        height: 25,
        top: 0,
        backgroundColor: 'black',
        left: '50%',
        transform: 'translate(-50%, 0)',
    },
    screen: {
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        borderRadius: 28,
        height: 730,
        width: 342,
        overflow: 'hidden',
        position: 'relative'
    }
})

export default withStyles(useStyles)(Screen)