// import React from 'react';
// import clsx from 'clsx'
// import keys from '../../config/keys'

// import { withStyles } from '@material-ui/core/styles';

// class Spinner extends React.Component {
//     constructor(props) {
//         super(props)
//     }

//     render() {
//         const { classes } = this.props

//         return (
//             <div className={classes.foldingCube}>
//                 <div className={clsx(classes.cube1, classes.cube)}></div>
//                 <div className={clsx(classes.cube2, classes.cube)}></div>
//                 <div className={clsx(classes.cube4, classes.cube)}></div>
//                 <div className={clsx(classes.cube3, classes.cube)}></div>
//             </div>
//         );
//     }
// }

// // https://loading.io/css/
// // https://tobiasahlin.com/spinkit/
// const useStyles = theme => ({
//     foldingCube: props => {
//         let {size, margin} = props
//         margin = margin ? margin : 20
//         return {
//             margin: `${margin}px auto`,
//             width: size ? size : 40,
//             height: size ? size : 40,
//             position: 'relative',
//             transform: 'rotateZ(45deg)',
            
//         }
//     },
//     cube: {
//         float: 'left',
//         width: '50%',
//         height: '50%',
//         position: 'relative',
//         transform: 'scale(1.1)',
//         '&::before': {
//             content: "''",
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             animation: '$foldCubeAngle 2.4s infinite linear both',
//             transformOrigin: '100% 100%',
//         }
        
//     },
//     cube1: {
//         '&::before': {
//             backgroundColor: 'black',
//             animationDelay: '-1.4s'
//         }
//     },
//     cube2: {
//         transform: 'scale(1.1) rotateZ(90deg)',
//         '&::before': {
//             backgroundColor: keys.APP_COLOR,
//             animationDelay: '-1.1s'
//         }
//     },
//     cube3: {
//         transform: 'scale(1.1) rotateZ(180deg)',
//         '&::before': {
//             backgroundColor: keys.APP_COLOR_4,
//             animationDelay: '-0.8s',
//         }
//     },
//     cube4: {
//         transform: 'scale(1.1) rotateZ(270deg)',
//         '&::before': {
//             backgroundColor: keys.APP_COLOR_2,
//             animationDelay: '-0.5s',
//         }
//     },

//     '@keyframes foldCubeAngle': {
//         '0%, 10%': {
//             transform: 'perspective(140px) rotateX(-180deg)',
//             opacity: 0, 
//         },
//         '25%, 75%': {
//             transform: 'perspective(140px) rotateX(0deg)',
//             opacity: 1, 
//         },
//         '90%, 100%': {
//             transform: 'perspective(140px) rotateY(180deg)',
//             opacity: 0, 
//         }
//     }
// });

// export default withStyles(useStyles)(Spinner)



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