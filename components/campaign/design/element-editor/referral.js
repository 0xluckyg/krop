import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import SectionTabs from './sub/section-tabs'
import {setProperty, getProperty} from './sub/functions'

let strings = new LocalizedStrings({
    en:{
        titleLabel: "Title",
        couponTitleLabel: "Coupon title",
        descriptionLabel: "Description",
        couponTextLabel: "Coupon text",
        couponImageLabel: "Coupon image",
        storeAddressLabel: "Store address",
        expirationLabel: "Expiration",
        expirationDescriptionLabel: "Coupon valid for (days) after receiving",
        buttonTextLabel: "Button text",
        couponTabLabel: "Referral coupon",
        couponButtonLabel: "Referral button",
        
    },
    kr: {
        titleLabel: "제목",
        couponTitleLabel: "쿠폰 제목",
        descriptionLabel: "설명",
        couponTextLabel: "쿠폰 설명",
        couponImageLabel: "쿠폰 이미지",
        storeAddressLabel: "가게 주소",
        expirationLabel: "사용 기간",
        expirationDescriptionLabel: "쿠폰이 유효한 기간 (일 수)",
        buttonTextLabel: "버튼 제목",
        couponTabLabel: "추천 쿠폰",
        couponButtonLabel: "추천 쿠폰 버튼",
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ReferralEditor extends React.Component {
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
    
    renderCouponEditor() {
        console.log(": ", this.getProperty(null, 'couponTitle'))
        const {state, setState, stage, element} = this.props
        return (
            <Fragment>
                <SectionContainer title={strings.titleLabel}>
                    <Input
                        label={strings.couponTitleLabel}
                        onChange={value => {
                            this.setProperty(null, 'couponTitle', value)
                        }}
                        value={this.getProperty(null, 'couponTitle')}
                    />
                </SectionContainer>
                <SectionContainer title={strings.descriptionLabel}>
                    <Input
                        label={strings.couponTextLabel}
                        onChange={value => {
                            this.setProperty(null, 'couponDescription', value)
                        }}
                        value={this.getProperty(null, 'couponDescription')}
                    />
                </SectionContainer>
                <SectionContainer title={strings.couponImageLabel}>
                    <ImageUploader 
                        property='couponImage'
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
                <SectionContainer title={strings.storeAddressLabel}>
                    <Input
                        label={strings.storeAddressLabel}
                        onChange={value => {
                            this.setProperty(null, 'couponAddress', value)
                        }}
                        value={this.getProperty(null, 'couponAddress')}
                    />
                </SectionContainer>
                <SectionContainer title={strings.expirationLabel}>
                    <Input
                        label={strings.expirationDescriptionLabel}
                        onChange={value => {
                            if (isNaN(value) || value < 0) return
                            this.setProperty(null, 'couponDuration', value)
                        }}
                        value={this.getProperty(null, 'couponDuration')}
                    />
                </SectionContainer>
            </Fragment>
        )
    }
    
    renderButtonEditor() {
        const {classes} = this.props
        return (
            <SectionContainer title={strings.buttonTextLabel}>
                <Input
                    label={strings.buttonTextLabel}
                    onChange={value => {
                        this.setProperty(null, 'buttonText', value)
                    }}
                    value={this.getProperty(null, 'buttonText')}
                />
            </SectionContainer>
        )
    }
    
    render() {
        const {editorType} = this.state
        return (
            <Fragment>
                <SectionTabs 
                    indicator="bottom" 
                    value={editorType} 
                    handleChange={(newValue) => {
                        this.setState({editorType: newValue})
                    }}
                    tabs={[{
                        name: strings.couponTitleLabel,
                        value: 0
                    }, {
                        name: strings.couponButtonLabel,
                        value: 1
                    }]}
                />
                {editorType == 0 ? 
                    this.renderCouponEditor() :
                    this.renderButtonEditor()
                }
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    optionContainer: {
        height: 'auto',
        paddingBottom: 13
    },
    optionTitle: {
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

export default withStyles(useStyles)(ReferralEditor)