import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import {setProperty, getProperty} from './functions'
import keys from '../../../../../config/keys'

class ShowAfter extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            tag: ''
        }
    }
    
    getProperty(propertyType, property) {
        const {selectedStage, selectedElement, selectedSectionElement} = this.props.state
        return getProperty({
            props: this.props, selectedStage, selectedElement, propertyType, property, selectedSectionElement
        })
    }
    
    setProperty(propertyType, property, value) {
        const {selectedStage, selectedElement, selectedSectionElement} = this.props.state
        setProperty({
            props: this.props, selectedStage, selectedElement, propertyType, property, value, selectedSectionElement
        })
    }
    
    getTags() {
        return this.getProperty(null, 'tags')
    }
    
    handleAddTag(tag) {
        let tags = this.getTags()
        let newTag = this.state.tag
        
        const special = /[^A-Za-z0-9]/
        if (tags.includes(newTag) || special.test(newTag)) return
        tags = [...tags, this.state.tag]
        
        this.setState({tag: ''})
        this.setProperty(null, 'tags', tags)
    }
    
    handleDeleteTag(i) {
        let tags = this.getTags()
        let newTags = [...tags]
        newTags.splice(i, 1)
        this.setProperty(null, 'tags', newTags)
    }
    
    renderTagChips() {
        const {classes} = this.props
        const tags = this.getTags()
        return (
            <div className={classes.chipsContainer}>
                {tags.map((tag, i) => {
                    return (
                        <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => this.handleDeleteTag(i)}
                            className={classes.chip}
                        />
                    );
                })}
            </div>    
        )
    }

    render() {
        const {classes} = this.props  
        return (          
            <div>
                <div className={classes.locationInputContainer}>
                    <TextField      
                        label="Add Tag"
                        style={{marginBottom: '2px'}}
                        value={this.state.tag}
                        onChange={(event) => {
                            this.setState({tag: event.target.value})
                        }}
                        onKeyPress={event => {
                            if (event.charCode === 13) { // enter key pressed
                                event.preventDefault();
                                this.handleAddTag()
                            } 
                        }}
                        helperText="Ex. subscribers"
                        className={classes.formControl}
                    />
                    <IconButton  className={classes.addButton}  onClick={() => this.handleAddTag()} 
                    size="small" variant="contained" color="primary">
                        <AddIcon className={classes.addButtonIcon} fontSize="small" />
                    </IconButton >
                </div>
                {this.renderTagChips()}
            </div>
        )
    }
}

const useStyles = theme => ({    
    formControl: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        flex: 1
    },
    locationInputContainer: {
        display: 'flex', alignItems: 'center', flex: 1
    },
    addButton: {
        
    },
    addButtonIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    chipsContainer: {
        marginTop: theme.spacing(1),
        flex: 1
    },
    chip: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    }
});

export default withStyles(useStyles)(ShowAfter);