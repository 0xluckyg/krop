import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import {setProperty, getProperty} from './sub/functions'

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
    
    getTextType() {
        const type = this.getProperty(null, 'type')
        switch(type) {
            case(keys.HEADING_ELEMENT):
                return 'Heading'
            case(keys.SUBHEADING_ELEMENT):
                return 'Subheading'
            case(keys.PARAGRAPH_ELEMENT):
                return 'Paragraph'
            default:
                return ''
        }
    }
    
    render() {
        const label = this.getTextType()
        return (
            <SectionContainer title={label + ' content'}>
                <Input
                    label={label}
                    onChange={value => {
                        this.setProperty(null, 'text', value)
                    }}
                    value={this.getProperty(null, 'text')}
                />
            </SectionContainer>
        )
    }
}

const useStyles = theme => ({    

})

export default withStyles(useStyles)(CheckboxEditor)