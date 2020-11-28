import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import Background from './background'
import Alert from './alert'
import Screen from './screen'
import Text from './text'
import Image from './image'
import MultipleChoice from './multiple-choice'
import Checkbox from './checkbox'
import Form from './form'
import Slider from './slider'
import Dropdown from './dropdown'
import Video from './video'
import Link from './link'

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
                    switch(element.type) {
                        case(keys.MULTIPLE_CHOICE_ELEMENT):
                            return <MultipleChoice
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.CHECKBOX_ELEMENT):
                            return <Checkbox
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.DROPDOWN_ELEMENT):
                            return <Dropdown
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.SLIDER_ELEMENT):
                            return <Slider
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.FORM_ELEMENT):
                            return <Form
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.EMAIL_ELEMENT):
                            return
                        case(keys.PHONE_ELEMENT):
                            return
                        case(keys.ADDRESS_ELEMENT):
                            return
                        case(keys.NAME_ELEMENT):
                            return
                        case(keys.LONG_FORM_ELEMENT):
                            return 
                        case(keys.PARAGRAPH_ELEMENT):
                        case(keys.HEADING_ELEMENT):
                        case(keys.SUBHEADING_ELEMENT):
                            return <Text
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.LINK_ELEMENT):
                            return <Link
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.IMAGE_ELEMENT):
                            return <Image
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                        case(keys.VIDEO_ELEMENT):
                            return <Video
                                key={element.type+i}
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={i}
                            />
                    }
                })}
                
            </React.Fragment>
        )
    }
    
    render() {
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
                    <Background
                        stage={selectedStage}
                        element={keys.BACKGROUND}
                        state={state}
                        setState={setState}
                    >
                        {this.renderElements()}
                    </Background>
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