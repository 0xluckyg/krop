import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import keys from '../../../../config/keys'
import MultipleChoiceEditor from './multiple-choice'
import BackgroundEditor from './background'
import AlertEditor from './alert'
import {getElement} from './sub/functions'

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
        const type = elm ? elm.type : null
        
        console.log(": ", type)
        switch(type) {
            case(keys.MULTIPLE_CHOICE_ELEMENT):
                return <MultipleChoiceEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.ALERT_SETTINGS):
                return <AlertEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.BACKGROUND_SETTINGS):
                return <BackgroundEditor
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
            nameMap[keys.STAGE_SETTINGS] = 'Stage Settings', 
            nameMap[keys.STYLE_SETTINGS] = 'Style Settings', 
            nameMap[keys.BACKGROUND_SETTINGS] = 'Background Settings', 
            nameMap[keys.TEXT_SETTINGS] = 'Text Settings', 
            nameMap[keys.LOGO_SETTINGS] = 'Logo Settings', 
            nameMap[keys.ALERT_SETTINGS] = 'Alert Settings'
            
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