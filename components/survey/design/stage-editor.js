import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

import keys from '../../../config/keys'
import ElementList from './draggable-list'
import SectionHeader from './element-editor/frame/section-container'


class StageEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    handleStageNameChange(newName, index) {
        const {state, setState} = this.props
        let newState = {...state}
        newState.stages[index].settings.name = newName
        setState(newState)
    }
    
    deleteStage(index) {
        const {state, setState} = this.props
        let newState = {...state}
        //if only one left
        if (newState.stages.length == 1) return
        
        //when current stage is above deleted 
        if ((newState.selectedStage > index) || 
        //when current stage is being deleted and it is at the top of the array
        (newState.selectedStage == index && index == newState.stages.length - 1)) {
            newState.selectedStage --   
        }
        
        newState.stages.splice(index, 1)
        
        setState(newState)
    }
    
    renderStageItem(index, element) {
        const {classes} = this.props
        return (
            <div className={classes.stageItemContainer}>
                <TextField
                    className={classes.stageItemTextField}
                    label="Stage Name"
                    value={element.settings.name}
                    onChange={event => this.handleStageNameChange(event.target.value, index)}
                /><br/>
                <DeleteIcon 
                    onClick={() => this.deleteStage(index)}
                    className={classes.stageDeleteIcon} 
                    fontSize="small" 
                />
            </div>
        )
    }
    
    renderExitButton() {
        const {classes, onExit} = this.props
        return (
            <Fragment>
                <IconButton  className={classes.exitButton}  onClick={onExit} 
                size="small" variant="contained" color="primary">
                    <CloseIcon className={classes.exitButtonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
    }
    
    renderMainHeader() {
        const {classes} = this.props
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>Edit Stages</p>
                {this.renderExitButton()}
            </div>    
        )
    }
    
    renderSubHeader(text) {
        const {classes} = this.props
        return (
            <div className={classes.subHeader}>
                <p className={classes.subHeaderText}>{text}</p>
            </div>    
        )
    }
    
    render() {
        const {classes, state, setState} = this.props
        return (
            <div className={classes.sideEditor}>
                {this.renderMainHeader()}
                <SectionHeader title="Stages (Drag to Reorder)"/>
                <div className={classes.elementsList}>
                    <ElementList 
                        customKey="Stage"
                        elements={state.stages}
                        setElements={(newElements, src, dest) => {
                            setState({stages: newElements})

                            let selectedStage = state.selectedStage
                            //If movement does not affect the current stage
                            if ((selectedStage > src && selectedStage > dest) || 
                                (selectedStage < src && selectedStage < dest)) return
                            //If current stage moved
                            if (selectedStage == src) return setState({selectedStage: dest})
                            //If source was above destination
                            if (src - dest > 0) return setState({selectedStage: selectedStage+1})
                            //Is source was below destination
                            if (src - dest < 0) return setState({selectedStage: selectedStage-1})
                        }}
                        wrapper={(index, element) => this.renderStageItem(index, element)}
                    />
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({    
    sideEditor: {
        position: 'absolute',
        top: 0,
        zIndex: 10,
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
        alignItems: 'center'
    },
    elementsHeaderText: {
        fontSize: 15,
        color: keys.APP_COLOR_GRAY_DARKEST,
        marginLeft: 20
    },
    exitButton: {
        marginRight: 20
    },
    exitButtonIcon: {
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
    elementsList: {
        width: '100%',
        flex: 1,
        overflowY: 'auto'
    },
    stageItemContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderBottom: '0.3px solid',
        borderTop: `0.15px solid ${keys.APP_COLOR_GRAY}`,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT
        }
    },
    stageItemTextField: {
        display: 'flex',
        alignItems: 'center',
        margin: '15px 30px'
    },
    stageDeleteIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '0px 30px'
    }
})

export default withStyles(useStyles)(StageEditor)