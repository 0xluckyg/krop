import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import MainboardPreview from './preview'
import SideEditor from './side-editor'
import keys from '../../../config/keys'

class Editor extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {classes, state, setState} = this.props
        return (
            <main className={classes.content}>      
                <div className={classes.editorMain}>
                    <MainboardPreview 
                        state={state}
                        setState={setState}
                    />
                    <SideEditor
                        state={state}
                        setState={setState}
                    />
                </div>
            </main>
        )
    }
}

const useStyles = theme => ({    
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    editorMain: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    }
})

export default withStyles(useStyles)(Editor)