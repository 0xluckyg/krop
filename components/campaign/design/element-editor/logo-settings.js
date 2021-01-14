import React, {Fragment} from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import ImageUploader from './sub/image-uploader'

let strings = new LocalizedStrings({
    en:{
        logoImageLabel: "Logo image"
    },
    kr: {
        logoImageLabel: "로고 이미지"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class LogoSettingsEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            editorType: 0
        }
    }

    render() {
        const {state, setState, stage, element} = this.props

        return (
            <Fragment>
                <SectionContainer title={strings.logoImageLabel}>
                    <ImageUploader 
                        stage={stage}
                        element={element}
                        state={state} 
                        setState={setState}
                        property="logo"
                    />
                </SectionContainer>
            </Fragment>
        )
    }
}

const useStyles = theme => ({    
    textTitle: {
        margin: 0,
        fontSize: 10,
        color: keys.APP_COLOR_GRAY_DARK
    },
    inputStyle: {
        border: 'none',
        background: 'transparent',
        fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        resize: 'none',
        fontSize: 15,
        whiteSpace: "pre-wrap",
        overflowY: 'auto',
        cursor: 'text',
        '&:focus': {
            outline: 'none'
        }
    },
    alignmentContainer: {
        marginTop: 20
    },
    alignmentTitle: {
        margin: 0,
        fontSize: 13,
        color: keys.APP_COLOR_GRAY_DARKEST
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    iconButton: {
        height: 100,
        width: 100
    },
})

export default withStyles(useStyles)(LogoSettingsEditor)