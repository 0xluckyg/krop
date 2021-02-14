import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ColorPicker from '../../../reusable/color-picker'
import {getElement, setProperty, getProperty} from './sub/functions'
import ImageUploader from './sub/image-uploader'

let strings = new LocalizedStrings({
    en:{
        backgroundColorLabel: "Background color",
        backgroundImageLabel: "Background image" 
    },
    kr: {
        backgroundColorLabel: "배경 색",
        backgroundImageLabel: "배경 이미지" 
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class BackgroundSettingsEditor extends React.Component {
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
        const {state, setState, stage, element} = this.props
        const {backgroundColor} = this.getElement()

        return (
            <Fragment>
                <SectionContainer title={strings.backgroundColorLabel}>
                    <ColorPicker
                        text={strings.backgroundColorLabel}
                        color={backgroundColor}
                        onChange={backgroundColor => this.setProperty(null, 'backgroundColor', backgroundColor)}
                    />
                </SectionContainer>
                <SectionContainer title={strings.backgroundImageLabel}>
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        property="backgroundImage"
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

export default withStyles(useStyles)(BackgroundSettingsEditor)