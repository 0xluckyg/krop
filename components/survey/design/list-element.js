import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import SectionIcon from '@material-ui/icons/SelectAll';
import RightIcon from '@material-ui/icons/ChevronRight';
import ButtonIcon from '@material-ui/icons/FontDownload';
import BoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ImageIcon from '@material-ui/icons/Image';
import TextIcon from '@material-ui/icons/FormatShapes';
import HtmlIcon from '@material-ui/icons/Code';
import FormIcon from '@material-ui/icons/ContactMail';
import AddIcon from '@material-ui/icons/Add';
import VideoIcon from '@material-ui/icons/YouTube';
import ShareIcon from '@material-ui/icons/Facebook';

import keys from '../../../config/keys'

class ListElement extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderIcon() {
        const {classes, elementType} = this.props
        
        switch(elementType) {
            case keys.SECTION:
                return <SectionIcon className={classes.icon} fontSize="small" />
            case keys.BUTTON:
                return <ButtonIcon className={classes.icon} fontSize="small" />
            case keys.BOX:
                return <BoxIcon className={classes.icon} fontSize="small" />
            case keys.IMAGE:
                return <ImageIcon className={classes.icon} fontSize="small" />
            case keys.TEXT:
                return <TextIcon className={classes.icon} fontSize="small" />
            case keys.HTML:
                return <HtmlIcon className={classes.icon} fontSize="small" />
            case keys.FORM:
                return <FormIcon className={classes.icon} fontSize="small" />
            case keys.VIDEO:
                return <VideoIcon className={classes.icon} fontSize="small" />
            case keys.SHARE:
                return <ShareIcon className={classes.icon} fontSize="small" />
            default:
                return null
        }
    }
    
    renderSubIcon(type) {
        const {classes} = this.props
        if (type == 'add') {
            return <AddIcon className={classes.icon} fontSize="small" />
        } else {
            return <RightIcon className={classes.icon} fontSize="small" />   
        }
    }

    render() {
        const {classes, elementName, elementType, type, onClick} = this.props

        return (
            <div className={classes.elementContainer} onClick={onClick}>
                <div className={classes.titleWrapper}>
                    {this.renderIcon()}
                    <p className={classes.elementText}>{
                        (elementName && elementName != '') ? elementName : elementType
                    }</p>
                </div>
                {this.renderSubIcon(type)}
            </div>
        );
    }
}

const useStyles = theme => ({
    elementContainer: {
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
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '0px 30px'
    },
    elementText: {
        margin: '20px 0px',
        fontSize: 15
    }
});

export default withStyles(useStyles)(ListElement)