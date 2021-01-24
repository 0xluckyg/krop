import React from 'react'
import clsx from 'clsx'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import elementStyle from '../../../../shared/campaign-styles/reusable'
import addressStyle from '../../../../shared/campaign-styles/address'
import formStyle from '../../../../shared/campaign-styles/form'
import alertStyle from '../../../../shared/campaign-styles/alert'
import keys from '../../../../config/keys'

let strings = new LocalizedStrings({
    en:{
        title: "Address",
        address1Label: "Address Line 1",
        address2Label: "Address Line 2",
        cityLabel: "City",
        stateLabel: "State",
        countryLabel: "Country",
        zipLabel: "Zip Code",
        alertLabel: "Please insert a valid address"
    },
    kr: {
        title: "주소",
        address1Label: "주소",
        address2Label: "상세 주소",
        cityLabel: "구/군/시",
        stateLabel: "도",
        countryLabel: "국가",
        zipLabel: "우편번호",
        alertLabel: "올바른 주소를 입력해 주세요!"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

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
                {strings.title}
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
                placeholder={strings.address1Label}
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
                placeholder={strings.address2Label}
            />
        )
    }
    
    renderCity() {
        const {classes} = this.props
        const {cityEnabled, stateEnabled} = this.getElement()
        if (!cityEnabled) return null
        return (
            <input 
                className={clsx(stateEnabled ? classes.frontAddressStyle : null, classes.addressStyle)}
                placeholder={strings.cityLabel}
            />
        )
    }
    
    renderState() {
        const {classes} = this.props
        const {stateEnabled} = this.getElement()
        if (!stateEnabled) return null
        return (
            <input 
                className={classes.addressStyle}
                placeholder={strings.stateLabel}
            />
        )
    }
    
    renderCountry() {
        const {classes} = this.props
        const {countryEnabled, zipEnabled} = this.getElement()
        if (!countryEnabled) return null
        return (
            <input 
                className={clsx(zipEnabled ? classes.frontAddressStyle : null, classes.addressStyle)}
                placeholder={strings.countryLabel}
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
                placeholder={strings.zipLabel}
            />
        )
    }
    
    renderAlert() {
        const {classes, state} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return (
            <p className={classes.alertStyle}>{strings.alertLabel}</p>
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
                {this.renderAlert()}
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

function getAlert(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.ALERT_SETTINGS})
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
    },
    alertStyle: props => {
        const {textColor} = getAlert(props)
        const {font, primaryColor} = getStyle(props)
        let style = isDesktop(props) ? alertStyle.ALERT_TEXT_DESKTOP : alertStyle.ALERT_TEXT
        return {
            ...style,
            font: font,
            color: textColor
        }
    }
});

export default withStyles(useStyles)(NAMEPreview)