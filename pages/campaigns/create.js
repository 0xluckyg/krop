// 1110 x 598 macbook
// 900 x 485 autosetup
// 900 x 485 website
// 900 x 485 slides


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../config/keys'
import { showToastAction, isLoadingAction } from '../../redux/actions';
import PageFooter from '../../components/reusable/page-footer';
import {loadFonts} from '../../components/reusable/font-families'

import TemplateSelector from '../../components/templates'
import TabBar from '../../components/campaign/tab-bar';
import MainEditor from '../../components/campaign/design'
import SettingsEditor from '../../components/campaign/settings'
import {defaultSettings} from '../../components/campaign/settings/settings-objects'
import {defaultStages, defaultStyles, defaultAlert, defaultAlertMessages} from '../../components/campaign/design/element-objects'
import ElementMenu from '../../components/campaign/design/element-menu'

let strings = new LocalizedStrings({
    en:{
        nameError: "Please give your campaign a name",
        createdAlert: "Campaign created!",
        createError: "Couldn't create the campaign. Please try again later",
        createLabel: "Create",
        discardLabel: "Discard",
        saveLabel: "Save"
    },
    kr: {
        nameError: "캠페인에 이름을 지어 주세요",
        createdAlert: "캠페인를 만들었습니다!",
        createError: "캠페인를 만드는데 실패했어요. 잠시후 다시 시도해 주세요",
        createLabel: "만들기",
        discardLabel: "취소",
        saveLabel: "저장"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class CreateCampaign extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            _id: '',
            
            //DEFAULT STATE
            path: '',
            enabled: true,

            //DESIGN STATE
            stages: defaultStages(),
            styles: defaultStyles(),
            alert: defaultAlert(),
            alertMessages: defaultAlertMessages(),
            settings: defaultSettings,
            //UI STATES
            templateOptions: null,
            viewMode: keys.PHONE_ELEMENT,
            selectedStage: 0,
            selectedElement: null,
            selectedPage: 0,
            selectedEditor: 0,
            previewScale: 0.8,
            elementMenuOpen: false,
            
            isLoading: false,
        }
    }

    static getDerivedStateFromProps(nextProps, state) {

        const editableCampaign = nextProps.edit

        if (editableCampaign && editableCampaign._id != state._id) {
            loadFonts(document, [editableCampaign.styles.font])
            return editableCampaign
        } else {
            const {getUserReducer} = nextProps
            if (getUserReducer && getUserReducer.domain) {
                if (!state.domain || state.domain == '') {
                    return {domain: getUserReducer.domain}
                } 
            }
            return {}
        }
    }
    
    //design, settings
    handleEditorChange(event, newValue) {
        this.setState({selectedEditor: newValue})
    }
    
    validateSubmit() {
        if (this.state.settings.name.length == 0) {
            this.props.showToastAction(true, strings.nameError, 'error')
            this.setState({selectedEditor: 1})
            return false
        }
        return true
    }

    async handleSubmit(isPreview) {
        try {
            if (!isPreview) { if (!this.validateSubmit()) return }
            
            let {alertMessages, path, enabled, settings, stages, styles, alert} = this.state
            let data = {alertMessages, path, enabled, settings, stages, styles, alert}
            this.setState({isLoading: true})
            //if edit
            if (this.props.handleEdit) {
                const _id = this.state._id
                this.props.handleEdit({...data, _id}, () => this.setState({isLoading: false}))
            } else {
                axios.post(process.env.APP_URL + '/create-campaign', data)
                .then(res => {
                    this.setState({isLoading: false})
                    this.props.showToastAction(true, strings.createdAlert, 'success')
                    window.location.replace('/campaigns/browse')
                }).catch((err) => {
                    this.setState({isLoading: false})
                    if (err.response && err.response.data) {
                        return this.props.showToastAction(true, err.response.data)
                    }
                    this.props.showToastAction(true, strings.createError, 'error')
                })
            }
        } catch(err) {
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.createError, '')
        }
    }
    
    renderEditor() {
        const {selectedEditor} = this.state
        const setState = (newState, callback) => {
            this.setState(newState, callback)
        }
        switch (selectedEditor) {
            case(0):
                return <MainEditor setState={setState} state={this.state}/>
            case(1):
                return <SettingsEditor setState={setState} state={this.state}/>
        }
    }
    
    renderFooter() {
        const {selectedEditor} = this.state
        if (!this.props.handleEdit) {
            return (
                <PageFooter
                    isLoading={this.state.isLoading}
                    saveLabel={strings.createLabel}
                    discardLabel={strings.discardLabel}
                    showSave={true}
                    showDiscard={false}
                    saveAction={() => this.handleSubmit()}
                    discardAction={() => {}}
                >
                    <TabBar indicator="top" value={selectedEditor} handleChange={this.handleEditorChange.bind(this)}/>
                </PageFooter>
            )
        } else {
            return (
                <PageFooter
                    isLoading={this.state.isLoading}
                    saveLabel={strings.saveLabel}
                    discardLabel={strings.discardLabel}
                    showSave={true}
                    showDiscard={true}
                    saveAction={() => this.handleSubmit()}
                    discardAction={() => {
                        this.setState({isLoading:false})
                        this.props.backAction()
                    }}
                >
                    <TabBar indicator="top" value={selectedEditor} handleChange={this.handleEditorChange.bind(this)}/>
                </PageFooter>
            )
        }
    }

    render() {
        const {classes} = this.props  
        return (            
            <main className={classes.content}>
                <TemplateSelector
                    templateOptions={this.state.templateOptions}
                    state={this.state}
                    setState={(state) => this.setState(state)}
                />
                {this.renderEditor()}
                {this.renderFooter()}
                <ElementMenu
                    state={this.state}
                    setState={(state) => this.setState(state)}
                    isOpen={this.state.elementMenuOpen}
                    close={() => this.setState({elementMenuOpen: false})}
                />
            </main>
        )
    }
}

const useStyles = theme => ({    
    content: {
		overflowX: 'hidden',
		overflowY: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
		    marginLeft: -keys.NAV_WIDTH,
		},
    }
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(CreateCampaign));