import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ColorPicker from '../../../reusable/color-picker'
import FontPicker from './sub/font-picker'
import {setProperty, getProperty} from './sub/functions'

class TextSettingsEditor extends React.Component {
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
    
    handleFontChange(font) {
        let newState = this.setProperty(null, 'font', font.family)
		this.props.setState(newState)
    }

    render() {
        const textColor = this.getProperty(null, 'textColor')

        return (
            <Fragment>
                <SectionContainer title="Color">
                    <ColorPicker
                        text="Text color"
                        color={textColor}
                        onChange={textColor => this.setProperty(null, 'textColor', textColor)}
                    />
                </SectionContainer>
                <SectionContainer title="Font">
                    <FontPicker
						onFontSelected={this.handleFontChange.bind(this)}
						searchable={true}
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

export default withStyles(useStyles)(TextSettingsEditor)