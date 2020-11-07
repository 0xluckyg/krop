import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@mdi/react'
import keys from '../../../../config/keys'
import BackgroundEditor from './background'
import AlertEditor from './alert'

class ElementEditor extends React.Component {
    constructor(props) {
        super(props)
    }

    removeElement() {
        
    }
    
    renderDeleteButton() {
        const {classes} = this.props
        let {selectedElement} = this.props.state
        if (selectedElement == keys.MAINBOARD || 
        selectedElement == keys.TAB || 
        selectedElement == keys.ALERT ||
        selectedElement == keys.BACKGROUND) {
            return null
        }
        return (
            <Fragment>
                <IconButton  className={classes.deleteButtonWrapper}  onClick={() => this.removeElement()} 
                size="small" variant="contained" color="primary">
                    <DeleteIcon className={classes.buttonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
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
    
    renderMainHeader(text) {
        const {classes} = this.props
        
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>{text}</p>
                <div>
                {this.renderDeleteButton()}
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

        switch(type) {
            case(keys.ALERT):
                return <AlertEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            case(keys.BACKGROUND):
                return <BackgroundEditor
                    stage={selectedStage}
                    element={selectedElement}
                    state={state}
                    setState={setState}
                />
            default:
                return
        }
    }
    
    render() {
        const {classes} = this.props
        const elm = this.getElement()
        let type = elm ? elm.type : null
        let name = elm ? elm.name : null
        let headerName = name ? name : type
        return (
            <div className={classes.sideEditor}>
                {this.renderMainHeader(headerName)}
                <div className={classes.elementEditor}>
                    
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