import React from 'react'
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

class BrandingPreview extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            openSettings: false
        }
    }
    
    render() {
        const {classes, getUserReducer} = this.props
        if (!getUserReducer || !getUserReducer.branding) return null
        
        return (
            <React.Fragment>
                <div onClick={() => this.setState({openSettings: true})} className={classes.brandingStyle}>
                    <img className={classes.logoStyle} src="../../../../static/app/logo-small.svg"/>
                    <span className={classes.textStyle}>Powered by Vivelop</span>
                </div>
            </React.Fragment>
        )
    }
}

function getBrandingStyle(props) {
    let {branding} = props.getUserReducer
    if (!branding) return {}
    let {style, position} = branding
    let {xAnchor, yAnchor} = position

    return {
        position: 'absolute',
        top: yAnchor == 'top' ? 10 : null,
        right: xAnchor == 'right' ? 10 : null,
        bottom: yAnchor == 'bottom' ? 10 : null,
        left: xAnchor == 'left' ? 10 : xAnchor == 'center' ? '50%' : null,
        transform: xAnchor == 'center' ? `translate(-50%, 0%)` : null,
        backgroundColor: style.color,
        borderRadius: 30,
        width: 'auto',
        height: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px 10px',
        cursor: 'pointer'
    }
}

function getTextStyle(props) {
    let {branding} = props.getUserReducer
    if (!branding) return {}
    let {style} = branding
    let colorBuffer = style.color.split(',')
    let textColor = (Number(colorBuffer[1]) == 255) ? 'black' : 'white'
    
    return {
        fontWeight: 100,
        fontSize: 8,
        color: textColor,
        paddingLeft: 10
    }
}

const useStyles = theme => ({
    brandingStyle: props => ({...getBrandingStyle(props)}),
    textStyle: props => ({...getTextStyle(props)}),
    logoStyle: {
        height: 15,
        width: 15
    },
    settingsModalStyle: {
        position: 'absolute',
        width: 380,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: 5,
        outline: 'none',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`
    }
})

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

export default connect(mapStateToProps, null)(withStyles(useStyles)(BrandingPreview));