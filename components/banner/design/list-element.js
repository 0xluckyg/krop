import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import RightIcon from '@material-ui/icons/ChevronRight';
import BoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ImageIcon from '@material-ui/icons/Image';
import TextIcon from '@material-ui/icons/FormatShapes';
import AddIcon from '@material-ui/icons/Add';
import VideoIcon from '@material-ui/icons/YouTube';
import QrIcon from '@material-ui/icons/CropFree';

import keys from '../../../config/keys'
import { Types } from 'aws-sdk/clients/batch';

class ListElement extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderIcon(type) {
        const {classes} = this.props
        
        switch(type) {
            case keys.QR_ELEMENT:
                return <QrIcon className={classes.icon} fontSize="small" />
            case keys.BOX_ELEMENT:
                return <BoxIcon className={classes.icon} fontSize="small" />
            case keys.IMAGE_ELEMENT:
                return <ImageIcon className={classes.icon} fontSize="small" />
            case keys.TEXT_ELEMENT:
                return <TextIcon className={classes.icon} fontSize="small" />
            case keys.VIDEO_ELEMENT:
                return <VideoIcon className={classes.icon} fontSize="small" />
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
        const {classes, element, onClick} = this.props
        const {name, type} = element
        return (
            <div className={classes.elementContainer} onClick={onClick}>
                <div className={classes.titleWrapper}>
                    {this.renderIcon(type)}
                    <p className={classes.elementText}>{
                        (name && name != '') ? name : type
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