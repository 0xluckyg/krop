import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import Switch from './sub/switch'
import {setProperty, getProperty} from './sub/functions'

class LinkEditor extends React.Component {
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
                <SectionContainer title="Link url">
                <Input
                    label='Link url'
                    onChange={value => {
                        this.setProperty(null, 'url', value)
                    }}
                    value={this.getProperty(null, 'url')}
                />
            </SectionContainer>
                <SectionContainer title="Link settings">
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title="Open link in new window"
                        property="newWindow"
                    />
                </SectionContainer>
            </Fragment>
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

export default withStyles(useStyles)(LinkEditor)