import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import Switch from './sub/switch'
import Tags from './sub/tags'
import SectionTabs from './sub/section-tabs'
import {setProperty, getProperty} from './sub/functions'

class FormEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            editorType: 0
        }
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
    
    getFormType() {
        const type = this.getProperty(null, 'type')
        switch(type) {
            case(keys.NAME_ELEMENT):
                return 'Name'
            case(keys.FORM_ELEMENT):
                return 'Form'
            case(keys.EMAIL_ELEMENT):
                return 'Email'
            case(keys.PHONE_ELEMENT):
                return 'Phone'
            default:
                return ''
        }
    }
    
    renderSettingsEditor() {
        const {state, setState, stage, element} = this.props
        return (
            <Fragment>
                <SectionContainer title={this.getFormType() + " settings"}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title="Required"
                        property="required"
                    />
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title="Number only"
                        property="numOnly"
                    />
                    <Input
                        label='Minimum length'
                        onChange={value => {
                            this.setProperty(null, 'minChar', event.target.value)
                        }}
                        value={this.getProperty(null, 'minChar')}
                        numOnly
                    />
                    <Input
                        label='Maximum length'
                        onChange={value => {
                             this.setProperty(null, 'maxChar', event.target.value)
                        }}
                        value={this.getProperty(null, 'maxChar')}
                        numOnly
                    />
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

export default withStyles(useStyles)(FormEditor)