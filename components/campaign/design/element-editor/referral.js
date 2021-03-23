import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';
import TextareaAutosize from 'react-autosize-textarea';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import SectionTabs from './sub/section-tabs'
import {setProperty, getProperty} from './sub/functions'
import ColorPicker from '../../../reusable/color-picker'
import Map from './sub/map'
import Switch from './sub/switch'

let strings = new LocalizedStrings({
    us:{
        titleLabel: "Title",
        couponTitleLabel: "Coupon title",
        descriptionLabel: "Description",
        couponTextLabel: "Coupon text",
        couponImageLabel: "Coupon image",
        storeAddressLabel: "Store address",
        customExpirationSwitchLabel: "Customize duration",
        expirationDescriptionCustomLabel: "Custom duration description",
        expirationLabel: "Expiration",
        expirationDescriptionLabel: "Coupon valid for (days) after receiving",
        buttonTextLabel: "Button text",
        couponTabLabel: "Referral coupon",
        couponShareLabel: "Share text",
        couponButtonLabel: "Button",
        couponStyleLabel: "Coupon style",
        backgroundColorLabel: "Coupon background color",
        textColorLabel: "Coupon text color",
        shareTextLabel: "Share text",
        shareTitleLabel: "Share title",

        latitude: 40.730859165035014,
        longitude: -73.99747556184082
    },
    kr: {
        titleLabel: "제목",
        couponTitleLabel: "쿠폰 제목",
        descriptionLabel: "설명",
        couponTextLabel: "쿠폰 설명",
        couponImageLabel: "쿠폰 이미지",
        storeAddressLabel: "가게 주소",
        customExpirationSwitchLabel: "커스텀 기간 정하기",
        expirationDescriptionCustomLabel: "커스텀 기간",
        expirationLabel: "사용 기간",
        expirationDescriptionLabel: "쿠폰이 유효한 기간 (일 수)",
        buttonTextLabel: "버튼 제목",
        couponTabLabel: "쿠폰",
        couponShareLabel: "공유 문자",
        couponButtonLabel: "버튼",
        couponStyleLabel: "쿠폰 스타일",
        backgroundColorLabel: "쿠폰 배경 컬러",
        textColorLabel: "쿠폰 글씨 컬러",
        shareTextLabel: "공유 글",
        shareTitleLabel: "공유 제목",

        latitude: 37.303317773055575,
        longitude: 127.07978024603273
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class ReferralEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            editorType: 0,
            customExpiration: false,
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

    static getDerivedStateFromProps(props, currentState) {
        const {selectedStage, selectedElement} = props.state
        let expiration = getProperty({
            props,
            selectedStage,
            selectedElement,
            property: 'couponExpiration'
        })
        if (isNaN(expiration) && !currentState.customExpiration) {
            return {
                customExpiration: true
            }
        }
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
        const {state, setState, stage, element, classes} = this.props
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
                    <TextareaAutosize
                        placeholder={strings.couponTextLabel}
                        type="text"
                        onChange={e => {
                            this.setProperty(null, 'couponDescription', e.target.value)
                        }}
                        className={clsx(classes.inputStyle, classes.mainTextStyle)}
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
                    <Map
                        google={this.props.google}
                        center={{lat: this.getProperty(null, 'coordinates')[0], lng: this.getProperty(null, 'coordinates')[1]}}
                        setCoordinates={(lat, lng) => {
                            this.setProperty(null, 'coordinates', [lat, lng])
                        }}
                        height='300px'
                        zoom={15}
                    />
                </SectionContainer>
                <SectionContainer title={strings.expirationLabel}>
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title={strings.customExpirationSwitchLabel}
                        
                        toggle={() => {
                            this.setState({
                                customExpiration: !this.state.customExpiration
                            })
                        }}
                        enabled={this.state.customExpiration}
                    />
                    {!this.state.customExpiration ? 
                    <Input
                        label={strings.expirationDescriptionLabel}
                        onChange={value => {
                            if (isNaN(value) || value < 0) return
                            this.setProperty(null, 'couponExpiration', value)
                        }}
                        value={this.getProperty(null, 'couponExpiration')}
                    /> : 
                    <Input
                        label={strings.expirationDescriptionCustomLabel}
                        onChange={value => {
                            this.setProperty(null, 'couponExpiration', value)
                        }}
                        value={this.getProperty(null, 'couponExpiration')}
                    />}
                </SectionContainer>
                <SectionContainer title={strings.couponStyleLabel}>
                    <ColorPicker
                        text={strings.backgroundColorLabel}
                        color={this.getProperty(null, 'couponPrimaryColor')}
                        onChange={color => this.setProperty(null, 'couponPrimaryColor', color)}
                    />
                </SectionContainer>

            </Fragment>
        )
    }

    renderShareEditor() {
        const {classes} = this.props
        return (
            <SectionContainer title={strings.shareTextLabel}>
                <Input
                    label={strings.shareTitleLabel}
                    onChange={value => {
                        this.setProperty(null, 'shareTitle', value)
                    }}
                    value={this.getProperty(null, 'shareTitle')}
                />
                <Input
                    label={strings.shareTextLabel}
                    onChange={value => {
                        this.setProperty(null, 'shareText', value)
                    }}
                    value={this.getProperty(null, 'shareText')}
                />
            </SectionContainer>
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
    
    renderEditor() {
        const {editorType} = this.state
        switch(editorType) {
            case(0):
                return this.renderCouponEditor()
            case(1):
                return this.renderShareEditor()
            case(2):
                return this.renderButtonEditor()
        }
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
                        name: strings.couponTabLabel,
                        value: 0
                    }, {
                        name: strings.couponShareLabel,
                        value: 1
                    }, {
                        name: strings.couponButtonLabel,
                        value: 2
                    }]}
                />
                {this.renderEditor()}
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
        '&:focus': {
            outline: 'none'
        }
    },
    mainTextStyle: {
        marginBottom: 10,
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text'
    },
})

export default withStyles(useStyles)(ReferralEditor)