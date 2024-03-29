import React from 'react'
import TextareaAutosize from 'react-autosize-textarea';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    us:{
        headingLabel: "Heading",
        subheadingLabel: "Subheading",
        paragraphLabel: "Paragraph"
    },
    kr: {
        headingLabel: "큰 글자 (h1)",
        subheadingLabel: "중간 글자 (h2)",
        paragraphLabel: "작은 글자 (p)"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class TextEditor extends React.Component {
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
    
    getTextType() {
        const type = this.getProperty(null, 'type')
        switch(type) {
            case(keys.HEADING_ELEMENT):
                return strings.headingLabel
            case(keys.SUBHEADING_ELEMENT):
                return strings.subheadingLabel
            case(keys.PARAGRAPH_ELEMENT):
                return strings.paragraphLabel
            default:
                return ''
        }
    }
    
    render() {
        const {classes} = this.props
        const label = this.getTextType()
        return (
            <SectionContainer title={label + ' content'}>
                <p className={classes.textTitle}>Text</p>
                <TextareaAutosize
                    onChange={e => {
                        this.setProperty(null, 'text', e.target.value)
                    }}
                    className={classes.inputStyle}
                    value={this.getProperty(null, 'text')}
                />
            </SectionContainer>
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

export default withStyles(useStyles)(TextEditor)