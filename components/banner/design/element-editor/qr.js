import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import Position from './sub/position'
import Style from './sub/style'

class QrEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {state, setState, element, getParentDimension} = this.props
        return (
            <Fragment>
                <Position
                    device={state.viewMode}
                    element={element}
                    state={state}
                    setState={setState}
                    getParentDimension={getParentDimension}
                />
                <Style
                    element={element}
                    state={state}
                    setState={setState}                    
                />
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(QrEditor)