// 1110 x 598 macbook
// 900 x 485 autosetup
// 900 x 485 website
// 900 x 485 slides


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import PageFooter from '../../components/reusable/page-footer';
import TabBar from '../../components/banner/tab-bar';
import MainEditor from '../../components/banner/design'
import TemplateSelector from '../../components/banner/templates'
import keys from '../../config/keys'
import {defaultBanner} from '../../components/banner/design/element-objects'
import {loadFonts} from '../../components/reusable/font-families'

class CreateBanner extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            domain: '',            
            //DESIGN STATE
            elements: [...defaultBanner().elements],
            mainboard: {...defaultBanner().mainboard}, 
            fonts: [],
            name: defaultBanner().name,
            
            //UI STATES
            selectedElement: null,
            selectedSectionElement: null,
            animationMax: 0,
            previewScale: 0.8,
            playAnimation: null, //show, exit, null
            editor: 0,
            viewMode: keys.DESKTOP_PROPERTY,
            isLoading: false,
            isInteractingWithPreview: false,
            backgroundWidth: 0,
            backgroundHeight: 0,
            
            bannerInstallInstructionOpen: false,
            //HELPER STATES
            templateOptions: null
        }
    }
    
    initiateTemplateSelector() {
        const handleSelectBanner = (newBanner, name) => {
            
            let banner = {...newBanner.template}
            let newState = {...this.state, ...banner}
            
            if (newBanner.template.fonts) {
                newBanner.template.fonts.map(font => {
                    if (!newState.fonts) {
                        newState.fonts = []
                    }
                    if (!newState.fonts.includes(font)) {
                        newState.fonts.push(font)
                    }
                })
            }
            
            this.setState({...newState, templateOptions: null})
        }   
        
        this.setState({templateOptions: [{
            skipDisallowed: true,
            templateType: keys.WIDGET_TEMPLATE,
            onSelect: (newBanner, name) => handleSelectBanner(newBanner, name)
        }]})
    }
    
    componentDidMount() {
        if (!this.props.handleEdit) {
            this.initiateTemplateSelector()   
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
    
    //design, behaviors
    handleEditorChange(event, newValue) {
        this.setState({editor: newValue})
    }
    
    validateSubmit() {
        if (this.state.name.length == 0) {
            this.props.showToastAction(true, 'Please give your banner a name', 'error')
            this.setState({editor: 1})
            return false
        }
        return true
    }

    validateFonts() {
        const bannerString = JSON.stringify(this.state.elements)
        let fonts = []
        
        this.state.fonts.map((font, i) => {
            if (bannerString.includes(font)) {
                fonts.push(font)
            }
        })
        this.setState({fonts})
        return fonts
    }

    async handleSubmit(isPreview) {
        try {
            if (!isPreview) { if (!this.validateSubmit()) return }
            
            let {domain, behaviors, elements, mainboard, name, fixed} = this.state
            const fonts = this.validateFonts()
            let data = {domain, behaviors, elements, mainboard, name, fixed, fonts}
            this.setState({isLoading: true})
            //if edit
            if (this.props.handleEdit) {
                const _id = this.state._id
                this.props.handleEdit({...data, _id}, () => this.setState({isLoading: false}))
            } else {
                axios.post(process.env.APP_URL + '/create-banner', data)
                .then(res => {
                    this.setState({isLoading: false})
                    this.props.showToastAction(true, 'Banner created!', 'success')
                    // window.location.replace('/banners/browse')
                }).catch((err) => {
                    console.log('er ', err)
                    this.props.showToastAction(true, `Couldn't create banner. Please try again later.`, 'error')
                    this.setState({isLoading: false})
                })
            }
        } catch(err) {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't create banner. Please try again later.", '')
        }
    }
    
    renderEditor() {
        const {editor} = this.state
        const setState = (newState, callback) => {
            this.setState(newState, callback)
        }
        switch (editor) {
            case(0):
                return <MainEditor setState={setState} state={this.state}/>
        }
    }
    
    renderFooter() {
        const {editor} = this.state
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
                    <TabBar indicator="top" value={editor} handleChange={this.handleEditorChange.bind(this)}/>
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
                    <TabBar indicator="top" value={editor} handleChange={this.handleEditorChange.bind(this)}/>
                </PageFooter>
            )
        }
    }

    render() {
        const {classes} = this.props  
        const {templateOptions} = this.state
        return (            
            <main className={classes.content}>
                {this.renderEditor()}
                {this.renderFooter()}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(CreateBanner));