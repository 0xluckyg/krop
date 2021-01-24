import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'
import {setProperty, getProperty} from './sub/functions'
import Input from './sub/input'

let strings = new LocalizedStrings({
    en:{
        loyaltyResetLabel: "Reset loyalty after",
        visitsLabel: "Number of visits",
        stampImageLabel: "Stamp image (30px x 30px)"
    },
    kr: {
        loyaltyResetLabel: "로열티 초기화 횟수",
        visitsLabel: "스캔 횟수",
        stampImageLabel: "스탬프 이미지 (30px x 30px)"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class LoyaltyEditor extends React.Component {
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
                <SectionContainer title={strings.loyaltyResetLabel}>
                    <Input
                        label={strings.visitsLabel}
                        onChange={value => {
                            if (value < 1) return
                            this.setProperty(null, 'stamp', value)
                        }}
                        value={this.getProperty(null, 'stamp')}
                        numOnly
                    />
                </SectionContainer>
                <SectionContainer title={strings.stampImageLabel}>
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        property="url"
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

export default withStyles(useStyles)(LoyaltyEditor)