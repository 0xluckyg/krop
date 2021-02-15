import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    us:{
        stageSettingsLabel: "Stage settings",
        stageNameLabel: "Stage name",
        questionPerPageLabel: "Show one question per page",
        saveStageLabel: "Save progress to this stage for the next visit"
    },
    kr: {
        stageSettingsLabel: "스테이지 설정",
        stageNameLabel: "스테이지 이름",
        questionPerPageLabel: "질문 하나당 한 페이지에 보여주기",
        saveStageLabel: "재방문자를 위한 진도 저장"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class StageSettingsEditor extends React.Component {
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
    
    render() {
        const {state, setState, stage, element} = this.props

        return (
            <SectionContainer title={strings.stageSettingsLabel}>
                <Input
                    label={strings.stageNameLabel}
                    onChange={value => {
                        this.setProperty(null, 'name', value)
                    }}
                    value={this.getProperty(null, 'name')}
                />
                <Switch 
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    title={strings.questionPerPageLabel}
                    property="questionPerPage"
                />
                <Switch 
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    title={strings.saveStageLabel}
                    property="saveStage"
                />
            </SectionContainer>
        )
    }
}

const useStyles = theme => ({    
    textTitle: {
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

export default withStyles(useStyles)(StageSettingsEditor)