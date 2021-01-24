import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import Tags from './sub/tags'
import SectionTabs from './sub/section-tabs'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        longformSettings: "Long form settings",
        requiredLabel: "Required",
        minLengthLabel: "Mininum length",
        maxLengthLabel: "Maximum length",
        placeholderLabel: "Placeholder",
        tagsLabel: "Tags",
        questionLabel: "Question",
        settingsTabLabel: "Settings",
        contentTabLabel: "Content"
    },
    kr: {
        longformSettings: "긴 양식 설정",
        requiredLabel: "필수",
        minLengthLabel: "최소 글자 수",
        maxLengthLabel: "최대 글자 수",
        placeholderLabel: "설명",
        tagsLabel: "태그들",
        questionLabel: "질문",
        settingsTabLabel: "설정",
        contentTabLabel: "내용"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class LongForm extends React.Component {
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
    
    renderSettingsEditor() {
        const {state, setState, stage, element} = this.props
        return (
            <Fragment>
                <SectionContainer title={strings.longformSettings}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.requiredLabel}
                        property="required"
                    />
                    <Input
                        label={strings.minLengthLabel}
                        onChange={value => {
                            this.setProperty(null, 'minChar', event.target.value)
                        }}
                        value={this.getProperty(null, 'minChar')}
                        numOnly
                    />
                    <Input
                        label={strings.maxLengthLabel}
                        onChange={value => {
                             this.setProperty(null, 'maxChar', event.target.value)
                        }}
                        value={this.getProperty(null, 'maxChar')}
                        numOnly
                    />
                </SectionContainer>
                <SectionContainer title={strings.tagsLabel}>
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
                <SectionContainer title={strings.questionLabel}>
                    <Input
                        label={strings.questionLabel}
                        onChange={value => {
                            this.setProperty(null, 'question', value)
                        }}
                        value={this.getProperty(null, 'question')}
                    />
                    <Input
                        label={strings.placeholderLabel}
                        onChange={value => {
                             this.setProperty(null, 'placeholder', event.target.value)
                        }}
                        value={this.getProperty(null, 'placeholder')}
                    />
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
                        name: strings.settingsTabLabel,
                        value: 0
                    }, {
                        name: strings.contentTabLabel,
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

export default withStyles(useStyles)(LongForm)