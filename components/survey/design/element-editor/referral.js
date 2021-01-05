import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import Input from './sub/input'
import ImageUploader from './sub/image-uploader'
import SectionTabs from './sub/section-tabs'
import {setProperty, getProperty} from './sub/functions'

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
                <SectionContainer title="Title">
                    <Input
                        label='Coupon Title'
                        onChange={value => {
                            this.setProperty(null, 'couponTitle', value)
                        }}
                        value={this.getProperty(null, 'couponTitle')}
                    />
                </SectionContainer>
                <SectionContainer title="Description">
                    <Input
                        label='Coupon Text'
                        onChange={value => {
                            this.setProperty(null, 'couponDescription', value)
                        }}
                        value={this.getProperty(null, 'couponDescription')}
                    />
                </SectionContainer>
                <SectionContainer title="Coupon Image">
                    <ImageUploader 
                        property='couponImage'
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
                <SectionContainer title="Store Address">
                    <Input
                        label='Store Address'
                        onChange={value => {
                            this.setProperty(null, 'couponAddress', value)
                        }}
                        value={this.getProperty(null, 'couponAddress')}
                    />
                </SectionContainer>
                <SectionContainer title="Expiration">
                    <Input
                        label='Coupon valid for (days) after receiving'
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
            <SectionContainer title="Button Text">
                <Input
                    label='Button Text'
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
                        name: "Referral Coupon",
                        value: 0
                    }, {
                        name: "Referral Button",
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