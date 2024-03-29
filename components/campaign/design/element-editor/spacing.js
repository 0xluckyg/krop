import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import SliderField from './sub/slider-field'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    us:{
        spacingUnitLabel: "Spacing unit",
        heightLabel: "Height"
    },
    kr: {
        spacingUnitLabel: "공간 수",
        heightLabel: "공간 높이"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class SpacingEditor extends React.Component {
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
    
    handleSpaceChange(space) {
        if (isNaN(space)) return null
        this.setProperty(null, 'space', space)
    }
    
    render() {
        const space = this.getProperty(null, 'space')
        return (
            <Fragment>
                <SectionContainer title={strings.spacingUnitLabel}>
                    <SliderField
                        textChange={event => {
                            this.handleSpaceChange(event.target.value)
                        }}
                        sliderChange={(event, value) => this.handleSpaceChange(value)}
                        value={space}
                        label={strings.heightLabel}
                        min={1}
                        max={30}
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

export default withStyles(useStyles)(SpacingEditor)