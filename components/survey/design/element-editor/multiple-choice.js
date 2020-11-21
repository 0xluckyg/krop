import React, {Fragment} from 'react'

import { withStyles } from '@material-ui/core/styles';

import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'
import Switch from './sub/switch'
import Tags from './sub/tags'

class MultipleChoiceEditor extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const {state, setState, stage, element} = this.props
        
        return (
            <Fragment>
                <SectionContainer title="Multiple choice settings">
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title="Required"
                        property="required"
                    />
                    <Switch 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        title='Has "Other" option'
                        property="hasOther"
                    />
                </SectionContainer>
                <SectionContainer title="Explainer image">
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
                <SectionContainer title="Tags">
                    <Tags 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                    />
                </SectionContainer>
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    
})

export default withStyles(useStyles)(MultipleChoiceEditor)