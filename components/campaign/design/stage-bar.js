import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@mdi/react'
import { 
    mdiContentCopy
} from '@mdi/js';
import shortid from 'shortid'

import keys from '../../../config/keys'
import Dialog from '../../reusable/dialog'
const stageQuota = 10

class StageBar extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            dialogOpen: false
        }
    }
    
    handleStageChange(event, newValue) {
        this.props.setState({
            selectedPage: 0,
            selectedStage: newValue, 
            elementEditorOpen: false, 
            stageEditorOpen: false,
            selectedElement: null
        })
    }
    
    generateStageId() {
        if (!this.props.state.stages || this.props.state.stages.length <= 0) return
        let sid = shortid.generate()
        let sidExists = false
        this.props.state.stages.map(stage => {
            if (stage.shortId && stage.shortId == sid) {
                sidExists = true
            }
        }) 
        
        while (sidExists) {
            sid = shortid.generate()
            sidExists = false
            this.props.state.stages.map(stage => {
                if (stage.shortId && stage.shortId == sid) {
                    sidExists = true
                }
            })  
        }
        
        return sid
    }

    handleDuplicateStage() {
        if (this.props.state.stages.length >= stageQuota) {
            return this.setState({dialogOpen: true})
        }
        
        let newState = {...this.props.state}
        let stageIndex = this.props.state.selectedStage
        
        let duplicateStage = {...newState.stages[stageIndex]}
        duplicateStage.settings.name = duplicateStage.settings.name + '-copy'
        duplicateStage.stageId = this.generateStageId()
        
        let newStages = [...newState.stages, duplicateStage]
        newState.stages = newStages
        newState.selectedStage = newStages.length - 1
        this.props.setState(newState)
    }
    
    renderDuplicateButton() {
        const {classes, setState} = this.props
        return (
            <IconButton  className={classes.button} onClick={() => this.handleDuplicateStage()}
            size="small" variant="outlined" color="primary">
                <Icon path={mdiContentCopy}
                    size={0.8}
                    color={keys.APP_COLOR_GRAY_DARKEST}
                />
            </IconButton >
        )
    }
    
    renderEditButton() {
        const {classes, setState} = this.props
        return (
            <IconButton  className={classes.button} onClick={() => setState({stageEditorOpen: true})}
            size="small" variant="outlined" color="primary">
                <EditIcon className={classes.buttonIcon} fontSize="small" />
            </IconButton >
        )
    }
    
    renderTabs() {
        const {classes, state} = this.props
        return (<Tabs 
            className={classes.tabs}
            value={state.selectedStage} 
            onChange={this.handleStageChange.bind(this)} 
            aria-label="stage-bar"
            variant="scrollable"
            scrollButtons="auto"
        >
            {state.stages.map((stage, index) => {
                return <Tab label={stage.settings.name} key={index} id={index}/>
            })}
        </Tabs>)
    }
    
    render() {
        const {classes, value, state} = this.props
        const {dialogOpen} = this.state
        return (
            <div className={classes.stageBar}>
                <Dialog
                    open={dialogOpen}
                    handleClose={() => this.setState({dialogOpen: false})}
                    title="Too many slides!"
                    description="You can only add up to 10 stages."
                    yesText="Okay"
                />
                {this.renderTabs()}
                <div className={classes.buttonWrapper}>
                    {this.renderDuplicateButton()}
                    {this.renderEditButton()}
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({    
    stageBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px -2px rgba(21,27,38,.15)',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1
    },
    tabs: {
        width: 700
    },
    buttonWrapper: {
        marginRight: 20
    },
    button: {
        marginLeft: 10,
    },
    buttonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    modalContent: {
		position: 'absolute',
		margin: '20',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
	},
	modalWrapper: {
	    padding: '30px 40px',    
	},
	addStageTextField: {
        display: 'flex',
        alignItems: 'center',
        // margin: '0px 30px'
    },
    addStageButton: {
        // margin: '0px 30px 15px 30px'
    }
})

export default withStyles(useStyles)(StageBar)