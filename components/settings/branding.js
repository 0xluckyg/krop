import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {showPaymentPlanAction, getUserResolveAction, getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';

const blackValue = 'rgba(0,0,0,0.7)'
const whiteValue = 'rgb(255,255,255)'
const brandingColors = [{
    value: blackValue,
    name: 'Black'
}, {
    value: whiteValue,
    name: 'White'
}]

const positionDefaultValue = {
    xAnchor: 'left',
    yAnchor: 'bottom'
}
const brandingPositions = [{
    value: {
        xAnchor: 'left',
        yAnchor: 'top'
    },
    name: 'Top left'
},{
    value: {
        xAnchor: 'center',
        yAnchor: 'top'
    },
    name: 'Top middle'
},{
    value: {
        xAnchor: 'right',
        yAnchor: 'top'
    },
    name: 'Top right'
},{
    value: {
        xAnchor: 'left',
        yAnchor: 'bottom'
    },
    name: 'Bottom left'
},{
    value: {
        xAnchor: 'center',
        yAnchor: 'bottom'
    },
    name: 'Bottom center'
},{
    value: {
        xAnchor: 'right',
        yAnchor: 'bottom'
    },
    name: 'Bottom right'
}]

class ChangeBranding extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            branding: null
        }
    }
    
    updateInfo() {
        const user = this.props.getUserReducer
        if (!user || !Object.keys(user).length) return
        const {branding} = user
        if (this.state.branding || !branding) return
        this.setState({branding})
    }
    
    submitInfo() {
        const {branding} = this.state
        const {_id} = this.props.getUserReducer
        const params = { branding, _id }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/update-branding', params, {
            withCredentials: true
        })
        .then((res) => {
            this.props.getUserResolveAction(res.data)
            this.props.showToastAction(true, `Branding options updated!`, 'success')
            this.setState({isLoading:false, isOpen: false})
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't save your branding options. Please try again later.`, 'error')   
            this.setState({isLoading:false})            
        })
    }
    
    componentDidMount() {
        this.updateInfo()
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.updateInfo()
    }
    
    onColorChange(color) {
        if (!this.state.branding) return
        
        let newBranding = {...this.state.branding}
        newBranding.style = {color}
        this.setState({branding: newBranding})
    }
    
    onPositionChange(position) {
        if (!this.state.branding) return
        
        position = JSON.parse(position)
        let newBranding = {...this.state.branding}
        newBranding.position = position
        this.setState({branding: newBranding})
    }
    
    onEnabledChange() {
        const user = this.props.getUserReducer
        if (!this.state.branding || !user) return
        if (user.payment.plan <= 0) {
            return this.props.showPaymentPlanAction(true)
        }
        let newBranding = {...this.state.branding}
        newBranding.enabled = !newBranding.enabled
        this.setState({branding: newBranding})
    }
    
    renderBrandSwitch() {
        const {classes} = this.props
        const {branding} = this.state
        const enabled = (branding) ? branding.enabled : true
        
        return (
            <FormControlLabel
                className={classes.switch}
                control={
                  <Switch checked={enabled} 
                  onChange={() => this.onEnabledChange()} />
                }
                label=" Brand mark enabled"
            />
        )
    }

    renderSelector(options, value, onChange, label) {
        const {classes} = this.props
        value = typeof value == 'string' ? value : JSON.stringify(value)
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    inputProps={{
                        name: 'selector',
                        id: 'selector',
                    }}
                >
                    {options.map((option, i) => {
                        const menuValue = typeof option.value == 'string' ? option.value : JSON.stringify(option.value)
                        return <MenuItem 
                            key={i} 
                            value={menuValue}>
                                {option.name ? option.name : option}
                            </MenuItem>
                    })}
                </Select>
            </FormControl>
        )
    }

    render() {
        const {classes} = this.props
        const {branding} = this.state
        const color = branding ? branding.style.color : blackValue
        const position = branding ? branding.position : positionDefaultValue
        
        return (            
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    Brand mark
                </Typography><br/>
                {this.renderBrandSwitch()}
                {this.renderSelector(brandingColors, color, (color) => this.onColorChange(color), 'Branding color')}
                <br/>
                {this.renderSelector(brandingPositions, position, (position) => this.onPositionChange(position), 'Branding position')}
                <Button 
                    onClick={() => this.submitInfo()}
                    size="large"
                    variant="outlined" 
                    color="primary" 
                    className={classes.button}
                    disabled={this.state.isLoading}
                >
                    Change
                </Button> 
            </Paper>
        )
    }
}

const useStyles = theme => ({    
    paper: {
        padding: theme.spacing(3, 5),
        // marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column'
    },    
    switch: {
        marginBottom: 20  
    },
    colorPickerContainer: {
        width: 300  
    },
    button: {         
        marginBottom: theme.spacing(2),
        marginTop: 40,
        fontSize: '13px',     
        width: 200
    },
    formControl: {
        width: 300
    },
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserResolveAction, showPaymentPlanAction, getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ChangeBranding));