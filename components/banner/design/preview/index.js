import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import Mainboard from './mainboard'
import Screen from './screen'
import QR from './qr'
import Text from './text'
import Box from './box'
import Image from './image'
import Video from './video'
import {getElement, getProperty} from '../element-editor/sub/functions'

class MainboardPreview extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            showHorizontalRuler: false,
            showVerticalRuler: false
        }
    }
    
    mouseEnter() {
        this.props.setState({isInteractingWithPreview: true})
    }
    
    mouseLeave() {
        this.props.setState({isInteractingWithPreview: false})
    }
    
    
    setCenterRuler(horizontal, vertical) {
        this.setState({
            showHorizontalRuler: horizontal,
            showVerticalRuler: vertical
        })
    }
    
    resetElementSelection() {
        this.props.setState({ selectedElement: null })
    }
    
    renderVerticalRuler() {
        const {classes} = this.props
        if (!this.state.showVerticalRuler) return
        return (
            <div className={classes.verticalRuler}/>
        )
    }
    
    renderHorizontalRuler() {
        const {classes} = this.props
        if (!this.state.showHorizontalRuler) return
        return (
            <div className={classes.horizontalRuler}/>
        )
    }
    
    getMainboardDimension() {
        const {selectedStage, backgroundWidth, backgroundHeight} = this.props.state
        const mainboard = getElement({
            props: this.props, selectedStage, selectedElement: keys.MAINBOARD_ELEMENT
        })
        const mainboardPosition = mainboard.position
        const width = (mainboardPosition.widthType == 'percent') ? backgroundWidth * mainboardPosition.width / 100 : mainboardPosition.width
        const height = (mainboardPosition.heightType == 'percent') ? backgroundHeight * mainboardPosition.height / 100 : mainboardPosition.height
        return { parentWidth: width, parentHeight: height }
    }
    
    getRndScale() {
        const props = this.props
        const {selectedStage, previewScale, viewMode} = props.state
        const mainboard = getElement({
            props, selectedStage, selectedElement: keys.MAINBOARD_ELEMENT
        })
        
        // const mainboardScale = mainboard.position.scale
        
        if (viewMode == keys.PHONE_ELEMENT) {
            return 1 * previewScale   
        } else {
            return 1
        }
    }
    
    renderElements() {
        const setCenterRuler = this.setCenterRuler.bind(this)
        const getParentDimension = this.getMainboardDimension.bind(this)
        const {state, setState} = this.props
        const rndScale = this.getRndScale()
        
        return (
            <React.Fragment>
                {state.elements.map((element, i) => {
                    const zIndex = state.elements.length - i
                    switch(element.type) {
                    case(keys.QR_ELEMENT):
                        return <QR
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    element={i}
                                    zIndex={zIndex}
                                    setCenterRuler={setCenterRuler}
                                    getParentDimension={getParentDimension}
                                    rndScale={rndScale}
                                />
                    case(keys.TEXT_ELEMENT):
                        return <Text
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    element={i}
                                    zIndex={zIndex}
                                    setCenterRuler={setCenterRuler}
                                    getParentDimension={getParentDimension}
                                    rndScale={rndScale}
                                />
                    case(keys.IMAGE_ELEMENT):
                        return <Image
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    element={i}
                                    zIndex={zIndex}
                                    setCenterRuler={setCenterRuler}
                                    getParentDimension={getParentDimension}
                                    rndScale={rndScale}
                                />
                    case(keys.BOX_ELEMENT):
                        return <Box
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    element={i}
                                    zIndex={zIndex}
                                    setCenterRuler={setCenterRuler}
                                    getParentDimension={getParentDimension}
                                    rndScale={rndScale}
                                />
                    case(keys.VIDEO_ELEMENT):
                        return <Video
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    element={i}
                                    zIndex={zIndex}
                                    setCenterRuler={setCenterRuler}
                                    getParentDimension={getParentDimension}
                                    rndScale={rndScale}
                                />
                    }
                    
                })}
            </React.Fragment>
        )
    }
    
    render() {
        const {classes, state, setState} = this.props
        return (
            <div 
                onMouseEnter={this.mouseEnter.bind(this)} 
                onMouseLeave={this.mouseLeave.bind(this)} 
                className={classes.previewContainer}
                onClick={() => this.resetElementSelection()}
            >
                <Screen state={state} setState={setState}>
                    <Mainboard 
                        element={keys.MAINBOARD_ELEMENT}
                        state={state}
                        setState={setState}
                    >
                        {this.renderVerticalRuler()}
                        {this.renderHorizontalRuler()}
                        {this.renderElements()}
                    </Mainboard>
                </Screen>
            </div>
        )
    }
}

const useStyles = theme => ({    
    previewContainer: props => {
        return {
            display: 'flex',
            height: "calc(100vh - 48px)",
            overflowY: 'hidden',
            overflowX: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            flex: 1,
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT  
        }  
    },
    verticalRuler: {
        position: 'absolute',
        left: '50%',
        height: '100%',
        width: '1px',
        backgroundColor: keys.APP_COLOR,
        zIndex: 100
    },
    horizontalRuler: {
        position: 'absolute',
        top: '50%',
        height: '1px',
        width: '100%',
        backgroundColor: keys.APP_COLOR,
        zIndex: 100
    }
})

export default withStyles(useStyles)(MainboardPreview)