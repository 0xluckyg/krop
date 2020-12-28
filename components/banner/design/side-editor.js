import React, {Fragment} from 'react'
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
import PhoneIcon from '@material-ui/icons/PhoneIphone';
import DesktopIcon from '@material-ui/icons/DesktopMac';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import keys from '../../../config/keys'
import ElementList from './draggable-list'
import ListElement from './list-element'
import ElementEditor from './element-editor'
import SectionHeader from  './element-editor/frame/section-header'
import {image} from './element-objects'

class StageBar extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
        }
    }
    
    handleElementSelect(element) {
        this.props.setState({selectedElement: element})
    }
    
    insertNewElement(element) {
        const {type, fonts} = element
        let newState = JSON.parse(JSON.stringify(this.props.state))
        let selectedElement
        if (type == keys.TAB || type == keys.ALERT) {
            newState.fixed[type] = {...element}
            selectedElement = (type == keys.TAB) ? keys.TAB : keys.ALERT
        } else if (type == keys.MAINBOARD_ELEMENT) {
            newState[type] = {...element}
            selectedElement = keys.MAINBOARD_ELEMENT
        } else {
            newState.elements = [element,...newState.elements]   
            selectedElement = 0
        }
        
        if (fonts) {
            fonts.map(font => {
                if (!newState.fonts) {
                    newState.fonts = []
                }
                if (!newState.fonts.includes(font)) {
                    newState.fonts.push(font)
                }
            })
        }
        
        this.props.setState(newState, () => {
            //had to set timeout because of a bug (changing element select also changes the element)
            setTimeout(() => {
                this.props.setState({selectedElement})
            }, 5)
        })
    }
    
    toggleElementSelector(event) {
        const handleSelectElement = (newWidget, name) => {
            let element = {...newWidget.template}
            this.insertNewElement(element)
        }
        
        const handleSelectMedia = (media, name) => {
            const {width, height} = media
            const defaultWidth = 500
            const ratio = defaultWidth / width
            const defaultHeight = height * ratio
            const imageElement = image(0,0, defaultWidth, defaultHeight)
            imageElement.position.aspectRatio = true
            if (media.mediaType == keys.SVG_PROPERTY) {
                imageElement.imageType = keys.SVG_PROPERTY
                imageElement.svg = media.media
            } else {
                console.log("M: ", media)
                imageElement.imageType = keys.IMAGE_PROPERTY
                imageElement.image = media.media
            }
            
            this.insertNewElement(imageElement)
        }   
        
        this.props.setState({templateOptions: [{
                templateType: keys.ELEMENT_TEMPLATE,
                onSelect: (newWidget, name) => handleSelectElement(newWidget, name)
            }, 
            // {
            //     templateType: keys.SURVEY_ELEMENT_TEMPLATE,
            //     onSelect: (newWidget, name) => handleSelectElement(newWidget, name)
            // }, 
            {
                templateType: keys.MEDIA_TEMPLATE,
                onSelect: (media, name) => handleSelectMedia(media, name)
            }
        ]})
    }
    
    getCurrentStageObject() {
        return this.props.state
    }
    
    toggleAnimation(type) {
        this.props.setState({playAnimation: (this.props.state.playAnimation == type) ? null : type})
    }
    
    renderAddButton() {
        const {classes} = this.props
        return (
            <Fragment>
                <IconButton  className={classes.addButton}  onClick={event => this.toggleElementSelector(event)} 
                size="small" variant="contained" color="primary">
                    <AddIcon className={classes.addButtonIcon} fontSize="small" />
                </IconButton >
            </Fragment>
        )
    }
    
    renderMainHeader() {
        const {classes} = this.props
        return (
            <div className={classes.elementsHeader}>
                <p className={classes.elementsHeaderText}>Elements</p>
                {this.renderAddButton()}
            </div>    
        )
    }
    
    renderIconWithSubtitle(Icon, subtitle) {
        const {classes} = this.props
        return (
            <div className={classes.iconContainer}>
                {Icon}
                <p className={classes.iconSubtitle}>
                    {subtitle}
                </p>
            </div>
        )
    }
    
    renderElementList() {
        const {state, setState, classes} = this.props
        
        if (!state.elements || state.elements.length <= 0) {
            return <div onClick={() => this.toggleElementSelector()} className={classes.noContentContainer}>
                <div className={classes.noContentWrapper}>
                    <AddCircleIcon className={classes.noContentIcon}/>
                    <p className={classes.noContentText}>No Elements</p>
                    <p className={classes.noContentSubtext}>Press the plus icon to add an element</p>
                </div>
            </div>
        }
        return (
            <ElementList 
                elements={state.elements}
                setElements={newElements => {
                    let newState = {...state}
                    newState.elements = newElements
                    setState(newState)
                }}
                wrapper={(type, name, index) => {
                    return <ListElement 
                        onClick={() => this.handleElementSelect(index)} 
                        elementType={type}
                        elementName={name}
                    />  
                }}
            />
        )
    }
    
    renderDeviceToggle() {
        const {classes, state, setState} = this.props
        const selected = classes.deviceToggleButton
        const notSelected = clsx(classes.deviceToggleButton, classes.deviceToggleButtonGray)
        this
        return (
            <div className={classes.deviceToggleContainer}>
                {this.renderIconWithSubtitle(
                    <IconButton  
                        className={state.viewMode == keys.DESKTOP_PROPERTY ? selected : notSelected} 
                        onClick={() => setState({viewMode: keys.DESKTOP_PROPERTY})} 
                        size="small" variant="contained" color="secondary">
                        <DesktopIcon fontSize="small" />
                    </IconButton>,
                    'Desktop'
                )}
                {this.renderIconWithSubtitle(
                    <IconButton  
                        className={state.viewMode == keys.PHONE_ELEMENT ? selected : notSelected} 
                        onClick={() => setState({viewMode: keys.PHONE_ELEMENT})} 
                        size="small" variant="contained" color="primary">
                        <PhoneIcon fontSize="small" />
                    </IconButton>,
                    'Mobile'
                )}
            </div>
        )
    }
    
    render() {
        const {classes, state, setState} = this.props
        return (
            <div className={classes.sideEditorContainer}>
                <div className={classes.sideEditorMain}>
                    <Slide direction="left" in={state.selectedElement != null} mountOnEnter unmountOnExit>
                        <ElementEditor
                            setState={setState}
                            state={state}
                            onExit={() => setState({selectedElement: null})}
                        />
                    </Slide>
                    <div className={classes.sideEditor}>
                        {this.renderMainHeader()}
                        <SectionHeader title="Mainboard Elements (Drag to Reorder)"/>
                        <div className={classes.elementsList}>
                            {this.renderElementList()}
                        </div>
                    </div>
                </div>
                <div className={classes.sideEditorFooter}>
                    <SectionHeader title="View as (Desktop or Mobile)"/>
                    {this.renderDeviceToggle()}
                </div>
            </div>
        )
    }
}

const useStyles = theme => ({  
    sideEditorContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 350
    },
    sideEditorMain: {
        position: 'relative',
        width: '100%',
        flex: 1
    },
    sideEditorFooter: {
        position: 'relative',
        width: '100%'
    },
    sideEditor: {
        top: 0,
        position: 'absolute',
        width: '100%',
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
        marginTop: 10,
        marginBottom: 10,
        color: 'white',
        marginLeft: 20,
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    addButton: {
        marginRight: 20
    },
    addButtonIcon: {
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
    fixedList: {
        width: '100%'
    },
    deviceToggleContainer: {
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 60
    },
    deviceToggleButton: {
        margin: '0px 10px',
        height: 40,
        width: 40
    },
    deviceToggleButtonGray: {
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSubtitle: {
        fontSize: 8,
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '-4px 0px 4px 0px'
    },
    noContentContainer: {
        flex: 1,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noContentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noContentIcon: {
        width: 50,
        height: 50,
        color: keys.APP_COLOR_GRAY_DARK,
        margin: 0,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
            transition: '0.2s',
            color: keys.APP_COLOR_GRAY_DARKEST
        },
        '&:active': {
            transition: '0.2s',
            opacity: 0.7
        }
    },
    noContentText: {
        fontSize: 20,
        color: keys.APP_COLOR_GRAY_DARK,
        margin: '8px 0px'
    },
    noContentSubtext: {
        fontSize: 13,
        color: keys.APP_COLOR_GRAY_DARK,
        margin: 0
    }
})

export default withStyles(useStyles)(StageBar)