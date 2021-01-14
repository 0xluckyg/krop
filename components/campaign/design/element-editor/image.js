import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'
import Switch from './sub/switch'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        imageLabel: "Image",
        displaySettingsLabel: "Display settings",
        cornerRoundingLabel: "Corner rounding"
    },
    kr: {
        imageLabel: "이미지",
        displaySettingsLabel: "이미지 설정",
        cornerRoundingLabel: "모서리 각 설정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class ImageEditor extends React.Component {
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
                <SectionContainer title={strings.imageLabel}>
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        property="url"
                    />
                </SectionContainer>
                <SectionContainer title={strings.displaySettingsLabel}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.cornerRoundingLabel}
                        property="rounding"
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

export default withStyles(useStyles)(ImageEditor)