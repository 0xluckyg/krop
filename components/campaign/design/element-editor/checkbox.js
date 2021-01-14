import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import Tags from './sub/tags'
import SectionTabs from './sub/section-tabs'
import OptionsList from '../../../reusable/draggable-list'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        checkboxSettingsLabel: "Checkbox settings",
        requiredLabel: "Required",
        otherOptionLabel: "Has 'Other' option",
        tagsLabel: "Tags",
        questionLabel: "Question",
        optionsLabel: "Options",
        settingsTabLabel: "Settings",
        contentTabLabel: "Content"
    },
    kr: {
        checkboxSettingsLabel: "체크박스 설정",
        requiredLabel: "필수",
        otherOptionLabel: "'기타' 옵션 추가",
        tagsLabel: "태그들",
        questionLabel: "질문",
        optionsLabel: "선택 사항",
        settingsTabLabel: "설정",
        contentTabLabel: "내용"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class CheckboxEditor extends React.Component {
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
                <SectionContainer title={strings.checkboxSettingsLabel}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.requiredLabel}
                        property="required"
                    />
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.otherOptionLabel}
                        property="hasOther"
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
        const {classes} = this.props
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
                </SectionContainer>
                <SectionContainer title={strings.optionsLabel}>
                    <OptionsList 
                        customKey={this.getProperty(null, 'id')}
                        elements={this.getProperty(null, 'options')}
                        setElements={newElements => {
                            this.setProperty(null, 'options', newElements)
                        }}
                        wrapper={(index, element) => {
                            console.log({index, element})
                            return <div className={classes.optionContainer}>
                                <p className={classes.optionTitle}>Option {index + 1}</p>
                                <input
                                    onChange={e => {
                                        let options = [...this.getProperty(null, 'options')]
                                        options[index].text = e.target.value
                                        this.setProperty(null, 'options', options)
                                    }}
                                    value={this.getProperty(null, 'options')[index].text}
                                    className={classes.inputStyle}
                                />
                            </div>
                        }}
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

export default withStyles(useStyles)(CheckboxEditor)