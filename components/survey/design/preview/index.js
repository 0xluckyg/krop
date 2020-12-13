import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import Background from './background'
import Alert from './alert'
import Screen from './screen'
import Header from './header'
import Spacing from './spacing'
import Text from './text'
import Image from './image'
import MultipleChoice from './multiple-choice'
import Checkbox from './checkbox'
import Form from './form'
import LongForm from './long-form'
import Slider from './slider'
import Dropdown from './dropdown'
import Video from './video'
import Link from './link'
import Name from './name'
import Address from './address'
import Button from './button'
import frameStyles from '../../../../shared/survey-styles/frame'
import {elementsToPages} from '../element-editor/sub/functions'

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
    
    getElementCountFromPages(pages) {
        const {selectedPage} = this.props.state
        let count = 0
        pages.map((page, i) => {
            if (i < selectedPage) {
                count += page.length   
            }
        })
        return count
    }
    
    renderElements() {
        const {state, setState, classes} = this.props
        const currentStage = state.stages[state.selectedStage]
        let mapper = []
        let offsetCounter = 0
        
        if (currentStage.settings.questionPerPage) {
            const {selectedPage} = state
            const pages = elementsToPages(currentStage.elements)
            mapper = pages[selectedPage]        
            offsetCounter = this.getElementCountFromPages(pages)   
        } else {
            mapper = currentStage.elements
        }
        return (
                <React.Fragment>
                    {mapper.map((element, i) => {
                        i = i + offsetCounter
                        switch(element.type) {
                            case(keys.SPACING_ELEMENT):
                                return <Spacing
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    stage={state.selectedStage}
                                    element={i}
                                />
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
                            case(keys.ADDRESS_ELEMENT):
                                return <Address
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    stage={state.selectedStage}
                                    element={i}
                                />
                            case(keys.NAME_ELEMENT):
                                return <Name
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    stage={state.selectedStage}
                                    element={i}
                                />
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
                            case(keys.EMAIL_ELEMENT):
                            case(keys.PHONE_ELEMENT):
                            case(keys.FORM_ELEMENT):
                                return <Form
                                    key={element.type+i}
                                    state={state}
                                    setState={setState}
                                    stage={state.selectedStage}
                                    element={i}
                                />
                            case(keys.LONG_FORM_ELEMENT):
                                return <LongForm
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
                    <div className={classes.surveyContainer}>
                        <Header
                            state={state}
                            setState={setState}
                            stage={state.selectedStage}
                        />
                        <div className={classes.surveyWrapper}>
                            <Background
                                stage={selectedStage}
                                element={keys.BACKGROUND_ELEMENT}
                                state={state}
                                setState={setState}
                            >
                                <div className={classes.pageWrapper}>
                                    {this.renderElements()}
                                    <Button
                                        state={state}
                                        setState={setState}
                                        stage={state.selectedStage}
                                        element={keys.BUTTON_ELEMENT}
                                    />
                                </div>
                            </Background>
                            <Alert
                                state={state}
                                setState={setState}
                                stage={state.selectedStage}
                                element={keys.ALERT_SETTINGS}
                            />
                        </div>
                    </div>
                </Screen>
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

const useStyles = theme => ({    
    previewContainer: props => {
        return {
            display: 'flex',
            height: "calc(100vh - 48px - 48px)",
            overflowY: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            flex: 1,
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT  
        }  
    },
    surveyContainer: props => {
        let style = isDesktop(props) ? frameStyles.SURVEY_CONTAINER_DESKTOP : frameStyles.SURVEY_CONTAINER
        return {
            ...style
        }
    },
    surveyWrapper: props => {
        let style = isDesktop(props) ? frameStyles.SURVEY_WRAPPER_DESKTOP : frameStyles.SURVEY_WRAPPER
        return {
            ...style
        }
    },
    pageWrapper: props => {
        let style = isDesktop(props) ? frameStyles.PAGE_WRAPPER_DESKTOP : frameStyles.PAGE_WRAPPER
        return {
            ...style
        }
    }
})

export default withStyles(useStyles)(MainboardPreview)