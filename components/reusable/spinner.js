import React from 'react';
import clsx from 'clsx'
import keys from '../../config/keys'

import { withStyles } from '@material-ui/core/styles';

class Spinner extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.spinner}>
                <div className={clsx(classes.doubleBounce1)}></div>
                <div className={clsx(classes.doubleBounce2)}></div>
            </div>
        );
    }
}

// https://loading.io/css/
// https://tobiasahlin.com/spinkit/
const useStyles = theme => ({
    spinner: props => {
        let {size, margin} = props
        margin = margin ? margin : 20
        return {
            margin: `${margin}px auto`,
            width: size ? size : 80,
            height: size ? size : 80,
            position: 'relative',
        }
    },
    doubleBounce1: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: keys.APP_COLOR,
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        left: 0,
        animation: '$bounce 2.0s infinite ease-in-out'
    },
    doubleBounce2: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: keys.APP_COLOR,
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        left: 0,
        animation: '$bounce 2.0s infinite ease-in-out',
        animationDelay: '-1.0s'
    },

    '@keyframes bounce': {
        '0%, 100%': {
            transform: 'scale(0.0)'
        },
        '50%': {
            transform: 'scale(1.0)'
        }
    }
});

export default withStyles(useStyles)(Spinner)