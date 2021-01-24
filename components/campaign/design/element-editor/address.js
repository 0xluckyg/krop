import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import Switch from './sub/switch'
import Tags from './sub/tags'
import SectionTabs from './sub/section-tabs'
import {getElement, setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        addressSettingsLabel: "Address settings",
        address1EnabledLabel: "Address 1 Enabled",
        address1RequiredLabel: "Address 1 Required",
        address2EnabledLabel: "Address 2 Enabled",
        address2RequiredLabel: "Address 2 Required",
        countryEnabledLabel: "Country Enabled",
        countryRequiredLabel: "Country Required",
        stateEnabledLabel: "State Enabled",
        stateRequiredLabel: "State Required",
        cityEnabledLabel: "City Enabled",
        cityRequiredLabel: "City Required",
        zipEnabledLabel: "Zip Enabled",
        zipRequiredLabel: "Zip Required",
        tagsLabel: "Tags",
        questionLabel: "Question",
        placeholderLabel: "Placeholder",
        settingsTabLabel: "Settings",
        contentTabLabel: "Content"
    },
    kr: {
        addressSettingsLabel: "주소 설정",
        address1EnabledLabel: "주소 1 추가",
        address1RequiredLabel: "주소 1 필수요소",
        address2EnabledLabel: "주소 2 추가",
        address2RequiredLabel: "주소 2 필수요소",
        countryEnabledLabel: "나라 추가",
        countryRequiredLabel: "나라 필수요소",
        stateEnabledLabel: "도 (예.경기도) 추가",
        stateRequiredLabel: "도 필수요소",
        cityEnabledLabel: "도시 추가",
        cityRequiredLabel: "도시 필수요소",
        zipEnabledLabel: "우편주소 추가",
        zipRequiredLabel: "우편주소 필수요소",
        tagsLabel: "태그들",
        questionLabel: "질문",
        placeholderLabel: "설명",
        settingsTabLabel: "설정",
        contentTabLabel: "내용"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

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
                <SectionContainer title={strings.addressSettingsLabel}>
                    {this.renderSwitch(strings.address1EnabledLabel, "address1Enabled")}
                    {address1Enabled ? this.renderSwitch(strings.address1RequiredLabel, "address1Required") : null}
                    
                    {this.renderSwitch(strings.address2EnabledLabel, "address2Enabled")}
                    {address2Enabled ? this.renderSwitch(strings.address2RequiredLabel, "address2Required") : null}
                    
                    {this.renderSwitch(strings.countryEnabledLabel, "countryEnabled")}
                    {countryEnabled ? this.renderSwitch(strings.countryRequiredLabel, "countryRequired") : null}
                    
                    {this.renderSwitch(strings.stateEnabledLabel, "stateEnabled")}
                    {stateEnabled ? this.renderSwitch(strings.stateRequiredLabel, "stateRequired") : null}
                    
                    {this.renderSwitch(strings.cityEnabledLabel, "cityEnabled")}
                    {cityEnabled ? this.renderSwitch(strings.cityRequiredLabel, "cityRequired") : null}
                    
                    {this.renderSwitch(strings.zipEnabledLabel, "zipEnabled")}
                    {zipEnabled ? this.renderSwitch(strings.zipRequiredLabel, "zipRequired") : null}
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
                    {this.getProperty(null, 'type') != keys.FORM_ELEMENT ? null : 
                        <Input
                            label={strings.placeholderLabel}
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

export default withStyles(useStyles)(AddressEditor)