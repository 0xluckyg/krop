import axios from 'axios';
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ColorPicker from '../reusable/color-picker'

import {getUserResolveAction, getUserAction, showToastAction, isLoadingAction } from '../../redux/actions';
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    en:{
        selectError: "Please select your app colors!",
        updatedAlert: "Colors updated!",
        saveError: "Couldn't save your colors. Please try again later",
        primaryColorLabel: "Primary app color",
        secondaryColorLabel: "Secondary app color",
        appColorsLabel: "App colors",
        changeLabel: "Change"
    },
    kr: {
        selectError: "컬러를 골라주세요!",
        updatedAlert: "컬러를 수정했어요!",
        saveError: "컬러를 수정할수 없어요. 잠시후 다시 시도해 주세요",
        primaryColorLabel: "메인 컬러",
        secondaryColorLabel: "보조 컬러",
        appColorsLabel: "앱 컬러",
        changeLabel: "바꾸기"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

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
            this.props.showToastAction(true, strings.selectError, 'error')
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
            this.props.showToastAction(true, strings.updatedAlert, 'success')
            this.setState({isLoading:false, isOpen: false})
        }).catch(() => {
            this.props.showToastAction(true, strings.saveError, 'error')   
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
                    text={strings.primaryColorLabel}
                    color={primaryColor}
                    onChange={primaryColor => this.setState({primaryColor})}
                /><br/>
                <ColorPicker
                    text={strings.secondaryColorLabel}
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
                    {strings.appColorsLabel}
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
                    {strings.changeLabel}
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