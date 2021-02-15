import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import keys from '../../../../config/keys'
import LoyaltyEditor from './loyalty'
import SpacingEditor from './spacing'
import ShareEditor from './share'
import ReferralEditor from './referral'
import MultipleChoiceEditor from './multiple-choice'
import CheckboxEditor from './checkbox'
import DropdownEditor from './dropdown'
import TextEditor from './text'
import SliderEditor from './slider'
import FormEditor from './form'
import AddressEditor from './address'
import LongFormEditor from './long-form'
import ImageEditor from './image'
import ImageUploadEditor from './image-upload'
import VideoEditor from './video'
import LinkEditor from './link'
import StageSettingsEditor from './stage-settings'
import StyleSettingsEditor from './style-settings'
import BackgroundSettingsEditor from './background-settings'
import TextSettingsEditor from './text-settings'
import AlertSettingsEditor from './alert-settings'
import LogoSettingsEditor from './logo-settings'

import {getElement} from './sub/functions'

let strings = new LocalizedStrings({
    us:{
        stageSettingsLabel: "Stage Settings",
        styleSettingsLabel: "Style Settings",
        backgroundSettingsLabel: "Background Settings",
        textSettingsLabel: "Text Settings",
        logoSettingsLabel: "Logo Settings",
        alertSettingsLabel: "Alert Settings"
    },
    kr: {
        stageSettingsLabel: "스테이지 설정",
        styleSettingsLabel: "스타일 설정",
        backgroundSettingsLabel: "배경 설정",
        textSettingsLabel: "글자 설정",
        logoSettingsLabel: "로고 설정",
        alertSettingsLabel: "알람 설정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class ElementEditor extends React.Component {
    constructor(props) {
        super(props)
    }

    getElement() {
        const {selectedStage, selectedElement} = this.props.state
        
        if (selectedElement == keys.STAGE_SETTINGS) {
            return this.props.state.stages[selectedStage].settings
        }
        
        if (selectedElement == keys.ALERT_SETTINGS) {
            return this.props.state.alert
        }
        
        const styleSettings = [
            keys.STYLE_SETTINGS, keys.BACKGROUND_SETTINGS, keys.TEXT_SETTINGS, keys.LOGO_SETTINGS
        ]
        
        if (styleSettings.includes(selectedElement)) {
            return this.props.state.styles
        }
        
        return getElement({
            props: this.props,
            selectedStage,
            selectedElement
        })
    }
    
    renderExitButton() {
        const {classes, onExit} = this.props
        return (
            <Fragment>
                <IconButton  className={classes.buttonIconWrapper}  onClick={onExit} 
                size="small" variant="contained" color="primary">
                    <CloseIcon className={classes.buttonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
    }
    
    renderMainHeader() {
        const {classes} = this.props
        
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>{this.getHeaderName()}</p>
                <div>
                {this.renderExitButton()}
                </div>
            </div>    
        )
    }
    
    renderSubHeader(text) {
        const {classes} = this.props
        return (
            <div className={classes.subHeader}>
                <p className={classes.subHeaderText}>{text} Element</p>
            </div>    
        )
    }
    
    renderEditorContent() {
        const {state, setState} = this.props
        const {selectedStage, selectedElement} = state
        const elm = this.getElement()
        let type = elm ? elm.type : null
        type = type ? type : selectedElement
        switch(type) {
            case(keys.LOYALTY_ELEMENT):
                return <LoyaltyEditor           
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.REFERRAL_ELEMENT):
                return <ReferralEditor           
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.SHARE_ELEMENT):
                return <ShareEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.SPACING_ELEMENT):
                return <SpacingEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.HEADING_ELEMENT):
            case(keys.SUBHEADING_ELEMENT):
            case(keys.PARAGRAPH_ELEMENT):
                return <TextEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.FORM_ELEMENT):
            case(keys.NAME_ELEMENT):
            case(keys.EMAIL_ELEMENT):
            case(keys.PHONE_ELEMENT):
                return <FormEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.ADDRESS_ELEMENT):
                return <AddressEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.LONG_FORM_ELEMENT):
                return <LongFormEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.SLIDER_ELEMENT):
                return <SliderEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.DROPDOWN_ELEMENT):
                return <DropdownEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.CHECKBOX_ELEMENT):
                return <CheckboxEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.MULTIPLE_CHOICE_ELEMENT):
                return <MultipleChoiceEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            
            case(keys.IMAGE_ELEMENT):
                return <ImageEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.IMAGE_UPLOAD_ELEMENT):
                return <ImageUploadEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.VIDEO_ELEMENT):
                return <VideoEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.LINK_ELEMENT):
                return <LinkEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            
            case(keys.STAGE_SETTINGS):
                return <StageSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.STYLE_SETTINGS):
                return <StyleSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.BACKGROUND_SETTINGS):
                return <BackgroundSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.TEXT_SETTINGS):
                return <TextSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.ALERT_SETTINGS):
                return <AlertSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.LOGO_SETTINGS):
                return <LogoSettingsEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            default:
                return null
        }
    }
    
    getHeaderName() {
        const elm = this.getElement()
        let type = elm ? elm.type : null
        let name = elm ? elm.name : null
        let headerName = name ? name : type
        if (headerName) {
            return headerName
        } else {
            let nameMap = {}
            nameMap[keys.STAGE_SETTINGS] = strings.stageSettingsLabel, 
            nameMap[keys.STYLE_SETTINGS] = strings.styleSettingsLabel, 
            nameMap[keys.BACKGROUND_SETTINGS] = strings.backgroundSettingsLabel, 
            nameMap[keys.TEXT_SETTINGS] = strings.textSettingsLabel, 
            nameMap[keys.LOGO_SETTINGS] = strings.logoSettingsLabel, 
            nameMap[keys.ALERT_SETTINGS] = strings.alertSettingsLabel
            
            return nameMap[this.props.state.selectedElement]
        }
    }
    
    render() {
        const {classes} = this.props
        return (
            <div className={classes.sideEditor}>
                {this.renderMainHeader()}
                <div className={classes.elementEditor}>
                    {this.renderEditorContent()}
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({    
    sideEditor: {
        position: 'absolute',
        top: 0,
        zIndex: 5,
        width: keys.SIDE_EDITOR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        boxShadow: '-1px 0px 3px -1px rgba(21,27,38,.15)'
    },
    elementsHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR_GRAY,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    elementsHeaderText: {
        fontSize: 15,
        color: keys.APP_COLOR_GRAY_DARKEST,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    deleteButtonWrapper: {
        marginRight: 10
    },
    buttonIconWrapper: {
        marginRight: 20
    },
    buttonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    subHeader: {
        width: '100%',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        display: 'flex',
        alignItems: 'center'
    },
    subHeaderText: {
        fontSize: 12,
        marginLeft: 20
    },
    elementEditor: {
        width: '100%',
        flex: 1,
        overflowY: 'auto'
    }
})

export default withStyles(useStyles)(ElementEditor)