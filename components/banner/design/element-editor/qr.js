import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import Position from './sub/position'
import Style from './sub/style'
import Input from './sub/input'
import SectionContainer from './frame/section-container'
import {getProperty, modifyProperty, getElement, modifyElement} from './sub/functions'

class QrEditor extends React.Component {
    constructor(props) {
        super(props)
    }

    getProperty(propertyType, property) {
        const {element} = this.props
        return getProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, property, 
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {element} = this.props
        modifyProperty({
            props: this.props, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
        })
    }

    getElement() {
        const {element} = this.props
        return getElement({
            props: this.props, 
            selectedElement: element,
        })
    }
    
    modifyElement(newElement) {
        const {element} = this.props
        modifyElement({
            props: this.props, 
            selectedElement: element, 
            element: newElement
        })
    }

    getQrLink() {
        return this.getProperty(null, 'value')
    }

    handleQrLinkChange(link) {
        const element = this.getElement()
        let newElement = JSON.parse(JSON.stringify(element))
        newElement.value = link
        this.modifyElement(newElement)
    }
    
    render() {
        const {state, setState, element, getParentDimension} = this.props
        return (
            <Fragment>
                <SectionContainer title="QR Campaign Url">
                    <Input
                        label='Campaign Url (Link)'
                        onChange={this.handleQrLinkChange.bind(this)}
                        value={this.getQrLink()}
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

export default withStyles(useStyles)(QrEditor)