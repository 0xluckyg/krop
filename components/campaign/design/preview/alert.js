import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import alertStyles from '../../../../shared/campaign-styles/alert'

let strings = new LocalizedStrings({
    us:{
        alertLabel: "Please fix the errors above!"
    },
    kr: {
        alertLabel: "위에 있는 오류들을 수정해 주세요!"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class AlertPreview extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {state, stage, element, classes} = this.props
        if (state.selectedElement != keys.ALERT_SETTINGS) return null
        return <div className={classes.containerStyle}>
            <p className={classes.textStyle}>{strings.alertLabel}</p>
        </div>
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getAlert(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

function getStyle(props) {
    let {stage} = props
    return getElement({props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
}

const useStyles = theme => ({    
    containerStyle: props => {
        let style = isDesktop(props) ? alertStyles.ALERT_POPUP_DESKTOP : alertStyles.ALERT_POPUP
        const {backgroundColor} = getAlert(props)
        return {
            ...style,
            backgroundColor
        }
    },
    textStyle: props => {
        let style = isDesktop(props) ? alertStyles.ALERT_POPUP_TEXT_DESKTOP : alertStyles.ALERT_POPUP_TEXT
        const {popupTextColor} = getAlert(props)
        const {font} = getStyle(props)
        return {
            ...style,
            color: popupTextColor,
            fontFamily: font
        }
    }
})

export default withStyles(useStyles)(AlertPreview)