import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import Switch from './sub/switch'
import Tags from './sub/tags'
import SectionTabs from './sub/section-tabs'
import {getElement, setProperty, getProperty} from './sub/functions'

class AddressEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            editorType: 0
        }
    }
    
    getElement() {
        const {selectedStage, selectedElement} = this.props.state
        return getElement({
            props: this.props,
            selectedStage,
            selectedElement
        })
    }
    
    getProperty(propertyType, property) {
        const {selectedStage, selectedElement} = this.props.state
        return getProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property
        })
    }
    
    setProperty(propertyType, property, value) {
        const {selectedStage, selectedElement} = this.props.state
        setProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property,
            value
        })
    }
    
    renderSwitch(title, property) {
        const {state, setState, stage, element} = this.props
        return (
            <Switch 
                stage={stage}
                element={element}
                state={state} 
                setState={setState}
                title={title}
                property={property}
            />
        )
    }
    
    renderSettingsEditor() {
        const {state, setState, stage, element} = this.props
        const {
            address1Enabled, address2Enabled, countryEnabled, stateEnabled, cityEnabled, zipEnabled
        } = this.getElement()
        return (
            <Fragment>
                <SectionContainer title={"Address settings"}>
                    {this.renderSwitch("Address 1 Enabled", "address1Enabled")}
                    {address1Enabled ? this.renderSwitch("Address 1 Required", "address1Required") : null}
                    
                    {this.renderSwitch("Address 2 Enabled", "address2Enabled")}
                    {address2Enabled ? this.renderSwitch("Address 2 Required", "address2Required") : null}
                    
                    {this.renderSwitch("Country Enabled", "countryEnabled")}
                    {countryEnabled ? this.renderSwitch("Country Required", "countryRequired") : null}
                    
                    {this.renderSwitch("State Enabled", "stateEnabled")}
                    {stateEnabled ? this.renderSwitch("State Required", "stateRequired") : null}
                    
                    {this.renderSwitch("City Enabled", "cityEnabled")}
                    {cityEnabled ? this.renderSwitch("City Required", "cityRequired") : null}
                    
                    {this.renderSwitch("Zip Code Enabled", "zipEnabled")}
                    {zipEnabled ? this.renderSwitch("Zip Code Required", "zipRequired") : null}
                </SectionContainer>
                <SectionContainer title="Explainer image">
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
                <SectionContainer title="Tags">
                    <Tags 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
            </Fragment>
        )
    }
    
    renderOptionsEditor() {
        return (
            <Fragment>
                <SectionContainer title="Question">
                    <Input
                        label='Question'
                        onChange={value => {
                            this.setProperty(null, 'question', value)
                        }}
                        value={this.getProperty(null, 'question')}
                    />
                    {this.getProperty(null, 'type') != keys.FORM_ELEMENT ? null : 
                        <Input
                            label='Placeholder'
                            onChange={value => {
                                 this.setProperty(null, 'placeholder', event.target.value)
                            }}
                            value={this.getProperty(null, 'placeholder')}
                        />
                    }
                </SectionContainer>
            </Fragment>
        )
    }
    
    render() {
        const {editorType} = this.state
        return (
            <Fragment>
                <SectionTabs 
                    indicator="bottom" 
                    value={editorType} 
                    handleChange={(newValue) => {
                        this.setState({editorType: newValue})
                    }}
                    tabs={[{
                        name: "Settings",
                        value: 0
                    }, {
                        name: "Content",
                        value: 1
                    }]}
                />
                {editorType == 0 ? 
                    this.renderSettingsEditor() :
                    this.renderOptionsEditor()
                }
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    optionContainer: {
        height: 'auto',
        paddingBottom: 13
    },
    optionTitle: {
        margin: 0,
        fontSize: 10,
        color: keys.APP_COLOR_GRAY_DARK
    },
    inputStyle: {
        border: 'none',
        background: 'transparent',
        fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        resize: 'none',
        fontSize: 15,
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text',
        '&:focus': {
            outline: 'none'
        }
    }
})

export default withStyles(useStyles)(AddressEditor)