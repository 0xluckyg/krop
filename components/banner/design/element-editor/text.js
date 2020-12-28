import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import SectionContainer from './frame/section-container'
import Position from './sub/position'
import Style from './sub/style'
import Wysiwyg from './sub/wysiwyg'

class TextEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    // TODO: ADD HTML EDITOR
    render() {
        const {state, setState, element, getParentDimension} = this.props
        return (
            <Fragment>
                <SectionContainer title="Text">
                <Wysiwyg
                    element={element}
                    state={state}
                    setState={setState}
                />
                </SectionContainer>
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

export default withStyles(useStyles)(TextEditor)