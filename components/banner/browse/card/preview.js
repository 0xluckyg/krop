import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys';
import Preview from '../../design/preview'

class CompiledPreview extends React.Component {      
    constructor(props) {
        super(props)
    }

    renderCSS() {
        const css = this.props.banner.compiled.css
        return (
            <style>
                {css}
            </style>    
        )
    }

    renderHTML() {
        const {classes} = this.props
        const html = this.props.banner.compiled.html
        return (
            <div className={classes.virtualBackground}>
                <div dangerouslySetInnerHTML={{__html: html}} />
            </div>
        )
    }

    render() {
        let {classes, banner} = this.props
        return (
            <div className={classes.previewContainer}>
                {this.renderCSS()}
                {this.renderHTML()}
            </div>
        );
    }
}

const sizeMultiplier = 3.5
const useStyles = theme => ({
    previewContainer: {
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    virtualBackground: {
        width: 300 * sizeMultiplier,
        height: 190 * sizeMultiplier,
        transformOrigin: 'top left',
        transform: `scale(${1 / sizeMultiplier}, ${1 / sizeMultiplier})`
    }
});

export default withStyles(useStyles)(CompiledPreview)