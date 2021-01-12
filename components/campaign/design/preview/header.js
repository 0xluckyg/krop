import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import headerStyles from '../../../../shared/campaign-styles/header'

class HeaderPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getStyle() {
        let {stage} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: keys.STYLE_SETTINGS})
    }
    
    getElement() {
        let {stage, element} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element})
    }

    renderTitle() {
        const {state, classes} = this.props
        const name = state.settings.name
        const {logo} = this.getStyle()
        if (logo && logo != '') return null
        return (
            <h3 
                className={classes.titleStyle}
            >
                {name}
            </h3>
        )
    }

    renderLogo() {
        const {classes} = this.props
        const {logo} = this.getStyle()
        if (!logo || logo == '') return null
        return (
            <img 
                src={logo}
                className={classes.logoStyle}
            />
        )
    }

    render() {
        const {classes, state} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderTitle()}
                {this.renderLogo()}
            </div>
        )
    }
}

function isDesktop(props) {
    let {viewMode} = props.state
    return viewMode == keys.DESKTOP_PROPERTY
}

function getStyle(props) {
    let {stage, element} = props
    return getElement({props, selectedStage: stage, selectedElement: element})
}

const useStyles = theme => ({
    containerStyle: props => {
        let style = isDesktop(props) ? headerStyles.HEADER_CONTAINER_DESKTOP : headerStyles.HEADER_CONTAINER
        const {backgroundColor} = getStyle(props)
        return {
            backgroundColor,
            ...style
        }  
    },
    titleStyle: props => {
        let style = isDesktop(props) ? headerStyles.TITLE_DESKTOP : headerStyles.TITLE
        const {primaryColor} = getStyle(props)
        return {
            
            color: primaryColor,
            ...style
        }
    },
    logoStyle: props => {
        let style = isDesktop(props) ? headerStyles.LOGO_DESKTOP : headerStyles.LOGO
        return {
            ...style
        }
    },
})

export default withStyles(useStyles)(HeaderPreview)