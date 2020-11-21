import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import Background from './background'
import Alert from './alert'
import Screen from './screen'
import Branding from './branding'

class MainboardPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getDevicePosition(element) {
        return (this.props.state.viewMode == keys.MOBILE_PROPERTY && element.mobile && element.mobile.enabled) ? keys.MOBILE_PROPERTY : keys.POSITION_PROPERTY
    }
    
    mouseEnter() {
        this.props.setState({isInteractingWithPreview: true})
    }
    
    mouseLeave() {
        this.props.setState({isInteractingWithPreview: false})
    }
    
    resetElementSelection() {
        this.props.setState({ selectedElement: null })
    }
    
    renderElements() {
        const {state, setState} = this.props
        const currentStage = state.stages[state.selectedStage]

        return (
            <React.Fragment>
                {currentStage.elements.map((element, i) => {
                    const zIndex = currentStage.elements.length - i
                })}
            </React.Fragment>
        )
    }
    
    render() {
        // <Background
        //                 stage={selectedStage}
        //                 element={keys.BACKGROUND}
        //                 state={state}
        //                 setState={setState}
        //             >
        //                 {this.renderElements()}
        //             </Background>
        //             <Branding/>
        //             <Alert
        //                 stage={selectedStage}
        //                 element={keys.ALERT}
        //                 state={state}
        //                 setState={setState}
        //             />
        const {classes, state, setState} = this.props
        const selectedStage = state.selectedStage
        return (
            <div 
                onMouseEnter={this.mouseEnter.bind(this)} 
                onMouseLeave={this.mouseLeave.bind(this)} 
                className={classes.previewContainer}
                onClick={() => this.resetElementSelection()}
            >
                <Screen state={state} setState={setState}>
                    
                </Screen>
            </div>
        )
    }
}

const useStyles = theme => ({    
    previewContainer: props => {
        return {
            display: 'flex',
            height: "calc(100vh - 48px - 48px)",
            overflowY: 'auto',
            // overflowX: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            flex: 1,
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT  
        }  
    }
})

export default withStyles(useStyles)(MainboardPreview)