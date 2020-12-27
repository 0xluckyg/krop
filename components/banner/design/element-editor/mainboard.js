import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { 
    mdiToggleSwitch,
    mdiToggleSwitchOffOutline
} from '@mdi/js';

import Position from './sub/position'
import Style from './sub/style'
import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'
import {modifyProperty, getProperty} from './sub/functions'
import keys from '../../../../config/keys'
import SubHeader from './frame/sub-header'


class MainboardEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getProperty(propertyType, property) {
        const {stage, element, sectionElement} = this.props
        return getProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, property, 
            selectedSectionElement: sectionElement
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {stage, element, sectionElement} = this.props
        modifyProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
    }
    
    handleStyleTypeChange(value) {
        this.modifyProperty(null, 'styleType', value)
    }
    
    getImageValue() {
        return this.getProperty(null, keys.IMAGE_PROPERTY)
    }
    
    getStyleTypeValue() {
        return this.getProperty(null, 'styleType')
    }
    
    render() {
        const {state, setState, stage, element, getParentDimension} = this.props
        return (
            <Fragment>
                <Position
                    device={state.viewMode}
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}
                />
                <Style
                    disabled={['borderColor', 'borderWidth']}
                    stage={stage}
                    element={element}
                    state={state}
                    setState={setState}
                />
                <SectionContainer title="Image">
                    <ImageUploader 
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

export default withStyles(useStyles)(MainboardEditor)