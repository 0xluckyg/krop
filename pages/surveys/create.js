// 1110 x 598 macbook
// 900 x 485 autosetup
// 900 x 485 website
// 900 x 485 slides


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';

import keys from '../../config/keys'
import { showToastAction, isLoadingAction } from '../../redux/actions';
import PageFooter from '../../components/reusable/page-footer';
import {loadFonts} from '../../components/reusable/font-families'

import TemplateSelector from '../../components/templates'
import TabBar from '../../components/survey/tab-bar';
import MainEditor from '../../components/survey/design'
import SettingsEditor from '../../components/survey/settings'
import {defaultSettings} from '../../components/survey/settings/settings-objects'
import {defaultStages, defaultStyles, defaultAlert} from '../../components/survey/design/element-objects'
import ElementMenu from '../../components/survey/design/element-menu'

class CreateSurvey extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            _id: '',
            
            //DESIGN STATE
            stages: defaultStages(),
            styles: defaultStyles(),
            alert: defaultAlert(),
            settings: defaultSettings,
            
            //UI STATES
            templateOptions: null,
            viewMode: keys.MOBILE_PROPERTY,
            selectedStage: 0,
            selectedElement: null,
            selectedPage: 0,
            selectedEditor: 0,
            previewScale: 0.8,
            elementMenuOpen: false,
            
            isLoading: false,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.edit && this.props.edit._id != prevState._id) {
            loadFonts(document, this.props.edit.fonts)
            this.setState(this.props.edit)
        } else {
            const {getUserReducer} = this.props
            if (getUserReducer && getUserReducer.domain) {
                if (!this.state.domain || this.state.domain == '') {
                    this.setState({domain: getUserReducer.domain})
                }
            }
        }
    }
    
    //design, settings
    handleEditorChange(event, newValue) {
        this.setState({selectedEditor: newValue})
    }
    
    validateSubmit() {
        if (this.state.settings.name.length == 0) {
            this.props.showToastAction(true, 'Please give your survey a name', 'error')
            this.setState({selectedEditor: 1})
            return false
        }
        return true
    }

    async handleSubmit(isPreview) {
        try {
            if (!isPreview) { if (!this.validateSubmit()) return }
            
            let {settings, stages, styles} = this.state
            let data = {settings, stages, styles}
            this.setState({isLoading: true})
            //if edit
            if (this.props.handleEdit) {
                const _id = this.state._id
                this.props.handleEdit({...data, _id}, () => this.setState({isLoading: false}))
            } else {
                axios.post(process.env.APP_URL + '/create-survey', data)
                .then(res => {
                    this.setState({isLoading: false})
                    this.props.showToastAction(true, 'Survey created!', 'success')
                    window.location.replace('/surveys/browse')
                }).catch(() => {
                    this.props.showToastAction(true, `Couldn't create survey. Please try again later.`, 'error')
                    this.setState({isLoading: false})
                })
            }
        } catch(err) {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't create survey. Please try again later.", '')
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
                    saveLabel="Create"
                    discardLabel="Discard"
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
                    saveLabel="Save"
                    discardLabel="Discard"
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(CreateSurvey));