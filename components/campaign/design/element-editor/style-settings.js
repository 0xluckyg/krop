import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { 
    mdiFormatAlignLeft,
    mdiFormatAlignCenter,
    mdiFormatAlignRight
} from '@mdi/js';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ColorPicker from '../../../reusable/color-picker'
import {getElement, setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    us:{
        colorLabel: "Color",
        primaryColorLabel: "Primary app color",
        secondaryColorLabel: "Secondary app color",
        alignLabel: "Align"
    },
    kr: {
        colorLabel: "색",
        primaryColorLabel: "메인 색",
        secondaryColorLabel: "보조 색",
        alignLabel: "정렬"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class StyleSettingsEditor extends React.Component {
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
    
    renderAnchorPicker() {
        let {classes} = this.props
        let align = this.getProperty(null, 'align')
        const selectedColor = keys.APP_COLOR
        const notSelectedColor = keys.APP_COLOR_GRAY_DARKEST
        return (
            <div className={classes.alignmentContainer}>
                <p className={classes.alignmentTitle}>Element Alignment</p>
                <div className={classes.iconContainer}>
                    <IconButton  
                        className={classes.iconButton} 
                        onClick={() => this.setProperty(null, 'align', 'left')}
                        size="small" variant="contained" color="primary">
                        <Icon path={mdiFormatAlignLeft}
                            size={2}
                            color={align == 'left' ? selectedColor : notSelectedColor}
                        />
                    </IconButton >
                    <IconButton  
                        className={classes.iconButton} 
                        onClick={() => this.setProperty(null, 'align', 'center')}
                        size="small" variant="contained" color="primary">
                        <Icon path={mdiFormatAlignCenter}
                            size={2}
                            color={align == 'center' ? selectedColor : notSelectedColor}
                        />
                    </IconButton >
                    <IconButton  
                        className={classes.iconButton} 
                        onClick={() => this.setProperty(null, 'align', 'right')}
                        size="small" variant="contained" color="primary">
                        <Icon path={mdiFormatAlignRight}
                            size={2}
                            color={align == 'right' ? selectedColor : notSelectedColor}
                        />
                    </IconButton >
                </div>
            </div>
        )
    }
    
    render() {
        const {state, setState, stage, element} = this.props
        const {primaryColor, secondaryColor} = this.getElement()

        return (
            <Fragment>
                <SectionContainer title={strings.colorLabel}>
                    <ColorPicker
                        text={strings.primaryColorLabel}
                        color={primaryColor}
                        onChange={primaryColor => this.setProperty(null, 'primaryColor', primaryColor)}
                    /><br/>
                    <ColorPicker
                        text={strings.secondaryColorLabel}
                        color={secondaryColor}
                        onChange={secondaryColor => this.setProperty(null, 'secondaryColor', secondaryColor)}
                    /><br/>
    
                </SectionContainer>
                <SectionContainer title={strings.alignLabel}>
                    {this.renderAnchorPicker()}
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

export default withStyles(useStyles)(StyleSettingsEditor)