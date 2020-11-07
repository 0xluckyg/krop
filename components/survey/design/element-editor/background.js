import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'

class BackgroundEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {state, setState, stage, element} = this.props
        
        return (
            <Fragment>
                <Fragment>
                    <SectionContainer title="Image">
                        <ImageUploader 
                            stage={stage}
                            element={element}
                            state={state} 
                            setState={setState}
                        />
                    </SectionContainer>
                </Fragment>
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(BackgroundEditor)