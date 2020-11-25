import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ColorPicker from '../../../reusable/color-picker'
import {getElement, setProperty, getProperty} from './sub/functions'

class AlertSettingsEditor extends React.Component {
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

    render() {
        const {textColor, popupTextColor, backgroundColor} = this.getElement()

        return (
            <Fragment>
                <SectionContainer title="Color">
                    <ColorPicker
                        text="Alert message color"
                        color={textColor}
                        onChange={textColor => this.setProperty(null, 'textColor', textColor)}
                    /><br/>
                    <ColorPicker
                        text="Alert popup background color"
                        color={backgroundColor}
                        onChange={backgroundColor => this.setProperty(null, 'backgroundColor', backgroundColor)}
                    /><br/>
                    <ColorPicker
                        text="Alert popup text color"
                        color={popupTextColor}
                        onChange={popupTextColor => this.setProperty(null, 'popupTextColor', popupTextColor)}
                    /><br/>
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
    },
    alignmentContainer: {
        marginTop: 20
    },
    alignmentTitle: {
        margin: 0,
        fontSize: 13,
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    iconButton: {
        height: 100,
        width: 100
    },
})

export default withStyles(useStyles)(AlertSettingsEditor)