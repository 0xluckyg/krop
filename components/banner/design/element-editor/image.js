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
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, property
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        return modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, 
            property, 
            value
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
        const {state, setState, element, getParentDimension} = this.props
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
                            element={element}
                            state={state} 
                            setState={setState}                            
                        /> 
                    </SectionContainer> :
                    <SectionContainer title="SVG Text">
                        <CodeEditor
                            element={element}
                            state={state} 
                            setState={setState}
                            label="SVG"
                            description="You can directly insert a svg text here"
                            property={keys.SVG_PROPERTY}                            
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
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}                    
                />
                <Style
                    disabled={["color"]}
                    element={element}
                    state={state}
                    setState={setState}                    
                />
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(ImageEditor)