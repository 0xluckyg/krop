import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys';
import Preview from '../../design/preview'

class CompiledPreview extends React.Component {      
    constructor(props) {
        super(props)
    }

    render() {
        let {classes, survey} = this.props
        let surveyCopy = {...JSON.parse(JSON.stringify(survey))}
        surveyCopy.selectedStage = 0
        surveyCopy.selectedPage = 0
        surveyCopy.previewScale = 0.5
        surveyCopy.cardMode = true
        surveyCopy.viewMode = keys.PHONE_ELEMENT
        return (
            <div className={classes.previewContainer}>
                <Preview 
                    state={surveyCopy}
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