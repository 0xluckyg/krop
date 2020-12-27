import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import Position from './sub/position'
import Style from './sub/style'
import Input from './sub/input'
import SectionContainer from './frame/section-container'
import {modifyProperty, getProperty} from './sub/functions'
import ImageUploader from './sub/image-uploader'
import SectionTabs from './sub/section-tabs'
import CodeEditor from './sub/code-editor'
import keys from '../../../../config/keys'

class ImageEditor extends React.Component {
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
        return modifyProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
    }
    
    handleActionChange(value) {
        this.modifyProperty(null, 'action', value)
    }
    
    getActionValue() {
        return this.getProperty(null, 'action')
    }
    
    getImageTypeValue() {
        return this.getProperty(null, 'imageType')
    }
    
    setImageTypeValue(value) {
        return this.modifyProperty(null, 'imageType', value)
    }
    
    render() {
        const {state, setState, stage, element, getParentDimension, sectionElement} = this.props
        let imageTypeValue = this.getImageTypeValue()
        return (
            <Fragment>
                <SectionTabs 
                    indicator="bottom" 
                    value={imageTypeValue} 
                    handleChange={(newValue) => {
                        this.setImageTypeValue(newValue)
                    }}
                    tabs={[{
                        name: "Image",
                        value: keys.IMAGE_PROPERTY
                    }, {
                        name: "SVG text",
                        value: keys.SVG_PROPERTY
                    }]}
                />
                {imageTypeValue == keys.IMAGE_PROPERTY ?
                    <SectionContainer title="Image">
                        <ImageUploader 
                            stage={stage}
                            element={element}
                            state={state} 
                            setState={setState}
                            
                            sectionElement={sectionElement}
                        /> 
                    </SectionContainer> :
                    <SectionContainer title="SVG Text">
                        <CodeEditor
                            stage={stage}
                            element={element}
                            state={state} 
                            setState={setState}
                            label="SVG"
                            description="You can directly insert a svg text here"
                            property={keys.SVG_PROPERTY}
                            
                            sectionElement={sectionElement}
                        />
                    </SectionContainer> 
                }
                <SectionContainer title="Options">
                    <Input
                        label='On Click (Link)'
                        onChange={this.handleActionChange.bind(this)}
                        value={this.getActionValue()}
                    />
                </SectionContainer>
                <Position
                    device={state.viewMode}
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}
                    
                    sectionElement={sectionElement}
                />
                <Style
                    disabled={["color"]}
                    stage={stage}
                    element={element}
                    state={state}
                    setState={setState}
                    
                    sectionElement={sectionElement}
                />
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(ImageEditor)