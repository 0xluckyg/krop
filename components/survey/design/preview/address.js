import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import elementStyle from '../../../../shared/survey-styles/reusable'
import addressStyle from '../../../../shared/survey-styles/address'
import formStyle from '../../../../shared/survey-styles/form'
import keys from '../../../../config/keys'

class NAMEPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    renderTitle() {
        const {classes} = this.props
        return (
            <p className={classes.titleStyle}>
                Address
            </p>
        )
    }
    
    renderAddress1() {
        const {classes} = this.props
        const {address1Enabled} = this.getElement()
        if (!address1Enabled) return null
        return (
            <input 
                className={classes.addressStyle}
                placeholder="Address Line 1"
            />
        )
    }
    
    renderAddress2() {
        const {classes} = this.props
        const {address2Enabled} = this.getElement()
        if (!address2Enabled) return null
        return (
            <input 
                className={classes.addressStyle}
                placeholder="Address Line 2"
            />
        )
    }
    
    renderCity() {
        const {classes} = this.props
        const {stateEnabled} = this.getElement()
        if (!stateEnabled) return null
        return (
            <input 
                className={clsx(stateEnabled ? classes.frontAddressStyle : null, classes.addressStyle)}
                placeholder="City"
            />
        )
    }
    
    renderState() {
        const {classes} = this.props
        const {stateEnabled} = this.getElement()
        if (!stateEnabled) return null
        return (
            <React.Fragment>
                <input 
                    className={classes.addressStyle}
                    placeholder="State"
                />
                
            </React.Fragment>
        )
    }
    
    renderCountry() {
        const {classes} = this.props
        const {countryEnabled, zipEnabled} = this.getElement()
        if (!countryEnabled) return null
        return (
            <input 
                className={clsx(zipEnabled ? classes.frontAddressStyle : null, classes.addressStyle)}
                placeholder="Country"
            />
        )
    }
    
    renderZip() {
        const {classes} = this.props
        const {zipEnabled} = this.getElement()
        if (!zipEnabled) return null
        return (
            <input 
                className={classes.addressStyle}
                placeholder="Zip Code"
            />
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderTitle()}
                {this.renderAddress1()}
                {this.renderAddress2()}
                <div className={classes.addressWrapperStyle}>
                    {this.renderCity()}
                    {this.renderState()}
                </div>
                <div className={classes.addressWrapperStyle}>
                    {this.renderCountry()}
                    {this.renderZip()}
                </div>
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

const useStyles = theme => ({
    containerStyle: props => {
        let style = isDesktop(props) ? elementStyle.CONTAINER_DESKTOP : elementStyle.CONTAINER
        return {
            ...style
        }
    },
    titleStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? elementStyle.QUESTION_DESKTOP : elementStyle.QUESTION
        let customStyle = isDesktop(props) ? addressStyle.ADDRESS_TITLE_DESKTOP : addressStyle.ADDRESS_TITLE
        return {
            ...style,
            ...customStyle,
            fontFamily: font, 
            color: textColor
        }
    },
    addressWrapperStyle: props => {
        let style = isDesktop(props) ? addressStyle.ADDRESS_WRAPPER_DESKTOP : addressStyle.ADDRESS_WRAPPER_DESKTOP
        return {
            ...style
        }
    },
    frontAddressStyle: props => {
        let style = isDesktop(props) ? addressStyle.FRONT_ADDRESS_DESKTOP : addressStyle.FRONT_ADDRESS
        return {
            ...style
        }
    },
    addressStyle: props => {
        const {font, textColor, primaryColor} = getStyle(props)
        let customStyle = isDesktop(props) ? addressStyle.ADDRESS_DESKTOP : addressStyle.ADDRESS
        let style = isDesktop(props) ? formStyle.FORM_DESKTOP : formStyle.FORM
        return {
            ...style,
            ...customStyle,
            font: font,
            color: textColor,
            borderColor: textColor,
            '&:focus': {
                ...style.FOCUS  
            },
            '&::placeholder': {
                ...style.PLACEHOLDER,
                color: textColor,
                fontFamily: font
            }
        }
    }
});

export default withStyles(useStyles)(NAMEPreview)