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
        const {state, setState, stage, element, getParentDimension, sectionElement} = this.props
        return (
            <Fragment>
                <SectionContainer title="Text">
                <Wysiwyg
                    stage={stage}
                    element={element}
                    state={state}
                    setState={setState}
                    
                    sectionElement={sectionElement}
                />
                </SectionContainer>
                <Position
                    device={state.viewMode}
                    stage={stage}
                    element={element}
                    state={state} 
                    setState={setState}
                    getParentDimension={getParentDimension}
                    
                    sectionElement={sectionElement}
                />
                <Style
                    stage={stage}
                    element={element}
                    state={state}
                    setState={setState}
                    
                    sectionElement={sectionElement}
                />
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(TextEditor)