import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys';
import Preview from '../../design/preview'

class CompiledPreview extends React.Component {      
    constructor(props) {
        super(props)
    }

    render() {
        let {classes, campaign} = this.props
        let campaignCopy = {...JSON.parse(JSON.stringify(campaign))}
        campaignCopy.selectedStage = 0
        campaignCopy.selectedPage = 0
        campaignCopy.previewScale = 0.5
        campaignCopy.cardMode = true
        campaignCopy.viewMode = keys.PHONE_ELEMENT
        return (
            <div className={classes.previewContainer}>
                <Preview 
                    state={campaignCopy}
                    setState={() => {}}
                ></Preview>
            </div>
        );
    }
}

const sizeMultiplier = 3.5
const useStyles = theme => ({
    previewContainer: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        // transformOrigin: 'top left',
        // transform: `scale(${1 / sizeMultiplier}, ${1 / sizeMultiplier})`
    },
    virtualBackground: {
        width: 300 * sizeMultiplier,
        height: 190 * sizeMultiplier,
        transformOrigin: 'top left',
        transform: `scale(${1 / sizeMultiplier}, ${1 / sizeMultiplier})`
    }
});

export default withStyles(useStyles)(CompiledPreview)