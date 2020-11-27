import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'
import dropdownStyle from '../../../../shared/survey-styles/dropdown'

class SelectorPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {stage, element, sectionElement} = this.props
        return getElement({props: this.props, selectedStage: stage, selectedElement: element, selectedSectionElement: sectionElement})
    }
    
    renderQuestion() {
        const {classes} = this.props
        const dropdown = this.getElement()
        return <p className={classes.questionStyle}>
            {dropdown.question}
        </p>
    }
    
    renderOptions() {
        const {classes} = this.props
        const dropdown = this.getElement()
        return <div className={classes.dropdownWrapperStyle}>
            <select className={classes.dropdownStyle}>
                <option>Please select one</option>
                {
                    dropdown.options.map((o, i)=> {
                        return <option key={o + i}>{o.text}</option>
                    })
                }
            </select>
        </div>
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.containerStyle}>
                {this.renderQuestion()}
                {this.renderOptions()}
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
        let style = isDesktop(props) ? dropdownStyle.CONTAINER_DESKTOP : dropdownStyle.CONTAINER
        return {
            ...style
        }
    },
    questionStyle: props => {
        const {font, textColor} = getStyle(props)
        let style = isDesktop(props) ? dropdownStyle.QUESTION_DESKTOP : dropdownStyle.QUESTION
        return {
            ...style,
            fontFamily: font, 
            color: textColor
        }
    },
    dropdownWrapperStyle: props => {
        let style = isDesktop(props) ? dropdownStyle.DROPDOWN_WRAPPER_DESKTOP : dropdownStyle.DROPDOWN_WRAPPER
        return {
            ...style,
            '&:after': {
                ...style.AFTER
                // background: secondaryColor,
                // color: 'white',
            }
        }
    },
    dropdownStyle: props => {
        let style = isDesktop(props) ? dropdownStyle.DROPDOWN_DESKTOP : dropdownStyle.DROPDOWN
        return {
            ...style,
            margin: 0,
            // fontSize: size, 
            // fontFamily: font, 
            // color
        }
    }
})

export default withStyles(useStyles)(SelectorPreview)