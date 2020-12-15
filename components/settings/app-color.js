import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ColorPicker from '../reusable/color-picker'

import {getUserResolveAction, getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';
import keys from '../../config/keys'

class ChangeAppColor extends React.Component {
    constructor(props){
        super(props)    

        this.state = {
            isLoading: false,
            
            primaryColor: '',
            secondaryColor: ''
        }
    }
    
    updateInfo() {
        const user = this.props.getUserReducer
        if (!user || !Object.keys(user).length) return
        const {primaryColor, secondaryColor} = user
        if (this.state.primaryColor != '' && this.state.secondaryColor != '') return
        let newState = {}
        if (primaryColor && (!this.state.primaryColor || this.state.primaryColor == '')) {
            newState.primaryColor = primaryColor
        } else {
            newState.primaryColor = keys.DEFAULT_PRIMARY_COLOR
        }
        if (secondaryColor && (!this.state.secondaryColor || this.state.secondaryColor == '')) {
            newState.secondaryColor = secondaryColor
        } else {
            newState.secondaryColor = keys.DEFAULT_SECONDARY_COLOR
        }
        this.setState(newState)
    }
    
    submitInfo() {
        const {primaryColor, secondaryColor} = this.state
        if (primaryColor == '' || secondaryColor == '') {
            this.props.showToastAction(true, `Please select your app colors!`, 'error')
            return
        }
        const {_id} = this.props.getUserReducer
        const params = { primaryColor, secondaryColor, _id }
        this.setState({isLoading: true})
        axios.post(process.env.APP_URL + '/update-user', params, {
            withCredentials: true
        })
        .then((res) => {
            this.props.getUserResolveAction(res.data)
            this.props.showToastAction(true, `Colors updated!`, 'success')
            this.setState({isLoading:false, isOpen: false})
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't save your colors. Please try again later.`, 'error')   
            this.setState({isLoading:false})            
        })
    }
    
    componentDidMount() {
        this.updateInfo()
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.updateInfo()
    }

    renderColorPicker() {
        const {classes} = this.props
        const {primaryColor, secondaryColor} = this.state
        return (
            <div className={classes.colorPickerContainer}>
                <ColorPicker
                    text="Primary app color"
                    color={primaryColor}
                    onChange={primaryColor => this.setState({primaryColor})}
                /><br/>
                <ColorPicker
                    text="Secondary app color"
                    color={secondaryColor}
                    onChange={secondaryColor => this.setState({secondaryColor})}
                />
            </div>
        )
    }

    render() {
        const {classes} = this.props
        return (            
            <Paper className={classes.paper}>
                <Typography variant="subtitle2" gutterBottom>
                    App Colors
                </Typography><br/>     
                {this.renderColorPicker()}
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
        display: 'flex',
        flexDirection: 'column'
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
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserResolveAction, getUserAction, showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ChangeAppColor));