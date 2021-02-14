import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import SectionContainer from './frame/section-container'
import ColorPicker from '../../../reusable/color-picker'
import PopoverWrapper from '../../../reusable/popover'

import FontPicker from './sub/font-picker'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        colorLabel: "Color",
        textColorLabel: "Text color",
        fontLabel: "Font",
        styleLabel: "Style"
    },
    kr: {
        colorLabel: "색",
        textColorLabel: "글자 색",
        fontLabel: "폰트",
        styleLabel: "스타일"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

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
        const {classes} = this.props
        return (
            <Fragment>
                <SectionContainer title={strings.colorLabel}>
                    <ColorPicker
                        text={strings.textColorLabel}
                        color={textColor}
                        onChange={textColor => this.setProperty(null, 'textColor', textColor)}
                    />
                </SectionContainer>
                <SectionContainer title={strings.fontLabel}>
                    <PopoverWrapper name={strings.styleLabel} style={classes}
                        customSelector={(onClick) =>
                            <TextField   
                                onClick={onClick}
                                onChange={() => {}}
                                value={this.getProperty(null, 'font')}
                                className={classes.fontPickerStyle}
                                label={strings.fontLabel}
                            />
                        }
                    >
    					<FontPicker
    						onFontSelected={this.handleFontChange.bind(this)}
    						searchable={true}
    					/>
    				</PopoverWrapper>
                </SectionContainer>
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    fontPickerStyle: {
        width: '100%'
    }
})

export default withStyles(useStyles)(TextSettingsEditor)