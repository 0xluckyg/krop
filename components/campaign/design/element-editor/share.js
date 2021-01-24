import React from 'react'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import keys from '../../../../config/keys'
import SectionContainer from './frame/section-container'
import {setProperty, getProperty} from './sub/functions'
import socialIcons from '../../../../static/campaign/social-icons';

let strings = new LocalizedStrings({
    en:{
        shareButtonsLabel: "Share buttons"
    },
    kr: {
        shareButtonsLabel: "공유 버튼"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class ShareEditor extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            editorType: 0
        }
    }
    
    getProperty(propertyType, property) {
        const {selectedStage, selectedElement} = this.props.state
        return getProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property
        })
    }
    
    setProperty(propertyType, property, value) {
        const {selectedStage, selectedElement} = this.props.state
        setProperty({
            props: this.props,
            selectedStage,
            selectedElement,
            propertyType,
            property,
            value
        })
    }

    chooseShareButton(platforms) {
        this.setProperty(null, 'platforms', platforms)
    }
    
    createSocialIcon(name) {
        const {svg, color} = socialIcons[name]
        
        if (!document) return null
        let a = document.createElement('a')
        a.style.display = 'inline-block'
        a.style.textDecoration = 'none'
        a.style.margin = '5px 7px'
        
        let innerDiv = document.createElement('div')
        innerDiv.style.margin = '0'
        innerDiv.style.verticalAlign = 'middle'
        innerDiv.style.fill = 'white'
        innerDiv.style.width = '30px'
        innerDiv.style.height = '30px'
        innerDiv.style.borderRadius = '5px'
        innerDiv.style.padding = '3px'
        innerDiv.style.display = 'inline-block'
        innerDiv.style.backgroundColor = color
        
        innerDiv.innerHTML = svg
        a.appendChild(innerDiv)
        return <div dangerouslySetInnerHTML={{__html: a.outerHTML}}/>
    }

    renderShareButtonsSelector() {
        const {classes} = this.props
        return (
            <div className={classes.selectorWrapper}>
                <Typography variant="subtitle2" gutterBottom>
                    {strings.shareButtonsLabel}
                </Typography>  
                {this.renderToggleButtons()}
            </div>
        )
    }

    renderToggleButtons() {
        const {classes} = this.props
        const chosenButtons = this.getProperty(null, 'platforms')
        return (
            <div className={classes.toggleButtonsWrapper}>
                <StyledToggleButtonGroup
                    size="small"
                    value={chosenButtons}
                    onChange={(event, newValue) => this.chooseShareButton(newValue)}
                    aria-label="text formatting"
                >
                    <ToggleButton value="facebook" aria-label="facebook">
                        {this.createSocialIcon("facebook")}
                    </ToggleButton>
                    <ToggleButton value="instagram" aria-label="instagram">
                        {this.createSocialIcon("instagram")}
                    </ToggleButton>
                    <ToggleButton value="twitter" aria-label="twitter">
                        {this.createSocialIcon("twitter")}
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </div>
        )
    }
    
    render() {
        const {classes} = this.props
        return (
            <SectionContainer title={strings.shareButtonsLabel}>
                {this.renderToggleButtons()}
            </SectionContainer>
        )
    }
}

const StyledToggleButtonGroup = withStyles(theme => ({
    grouped: {
        margin: theme.spacing(0.5),
        border: 'none',
        padding: theme.spacing(0, 1),
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
    },
  }))(ToggleButtonGroup);

const useStyles = theme => ({    
    toggleButtonsWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    selectorWrapper: {
        width: '100%',
        marginBottom: 10
    }
})

export default withStyles(useStyles)(ShareEditor)