import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import Tags from './sub/tags'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        requiredLabel: "Required",
        tagsLabel: "Tags",
        questionLabel: "Question",
        settingsLabel: "Settings"
    },
    kr: {
        requiredLabel: "필수",
        tagsLabel: "태그들",
        questionLabel: "질문",
        settingsLabel: "설정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ImageUploadEditor extends React.Component {
    constructor(props) {
        super(props)
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
                <SectionContainer title={strings.settingsLabel}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.requiredLabel}
                        property="required"
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
}

const useStyles = theme => ({    
})

export default withStyles(useStyles)(ImageUploadEditor)