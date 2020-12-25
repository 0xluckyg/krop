import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import EditSurvey from './create';
import List from '../../components/survey/browse/list'
import PageHeader from '../../components/reusable/page-header'
import NoContent from '../../components/reusable/no-content'
import Spinner from '../../components/reusable/spinner'
import keys from '../../config/keys'

class BrowseSurveys extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            surveys: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentEdit: undefined
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchSurveys(1)
    }
    
    fetchSurveys(page) {
        const params = { page }
        axios.get(process.env.APP_URL + '/get-surveys', {
            params,
            withCredentials: true
        }).then(res => {                        
            let result = res.data
            if (page > 1) {
                result.surveys = [...this.state.surveys, ...result.surveys]
                this.setState({...result, isloading: false})
            } else {
                this.setState({...result, ...{ isLoading: false }})
            }
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get surveys. Please try again later.")
            return err
        })
    }

    handleDelete(_id) {        
        const params = { _id }
        this.setState({isLoading:true})
        axios.post(process.env.APP_URL + '/delete-survey', params, {
            withCredentials: true
        })
        .then(() => {
            this.props.showToastAction(true, 'Survey deleted!', 'success')
            this.setState({isLoading:false})
            this.fetchSurveys(this.state.page)
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't delete survey. Please try again later.`, 'error')
            this.setState({isLoading:false})            
        })
    }

    handleDuplicate(survey) {
        this.setState({isLoading:true})
        
        const lastChar = parseInt(survey.settings.name[survey.settings.name.length - 1])
        if (!isNaN(lastChar)) {
            survey.settings.name = survey.settings.name.slice(0, -1) + (lastChar+1)
        } else {
            survey.settings.name = survey.settings.name + " 2"
        }
        survey.views = 0
        survey.submits = 0
        survey.updatedAt = new Date()
        survey.createdAt = new Date()
        delete survey._id
        
        axios.post(process.env.APP_URL + '/create-survey', survey)
        .then(res => {
            this.fetchSurveys(this.state.page)
            this.setState({isLoading: false})
            this.props.showToastAction(true, 'Survey copied!', 'success')
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't duplicate survey. Please try again later.`, 'error')
            this.setState({isLoading: false})
        })
    }

    handleEdit(data, callback) {
        axios.put(process.env.APP_URL + '/update-survey', data)
        .then(res => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, 'Survey edited!', 'success')
            this.updateSurvey(res.data)
        }).catch(() => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, `Couldn't edit survey. Please try again later.`, 'error')
        })
    }
    
    //if a row is edited, goes through the current page array and updates the edited item with the new item
    updateSurvey(newSurvey) {        
        let surveys = this.state.surveys
        const index = surveys.findIndex(d => d._id == newSurvey._id)
        if (index < 0) return
        surveys[index] = newSurvey
        this.setState({surveys})
    }
    
    renderContent() {
        const {classes} = this.props
        if (this.state.isLoading) {
            return (
                <div className={classes.container}>
                    <Spinner/>
                </div>
            )
        }
        if (this.state.surveys.length <= 0) {
            return (
                <div className={classes.noContentWrapper}>
                    <NoContent
                        iconPath="../../static/survey/add-image.svg"
                        text='Hey there,'
                        subText="It looks like you don't have a survey or a webpage set up yet. Let's create one now!"
                        actionText='Set up a Campaign'
                        footerText="Your campaigns wil show up here after creation."
                        action={() => {
                            window.location.replace(`${process.env.APP_URL}/surveys/create`)
                        }}
                    />
                </div>
            )
        }
        return (
            <List 
                edit={this.handleEdit.bind(this)}
                delete={this.handleDelete.bind(this)}  
                duplicate={this.handleDuplicate.bind(this)}
                fetch={this.fetchSurveys.bind(this)}
                state={this.state} 
                setState={(state) => this.setState(state)}
            />  
        )
    }

    render() {
        const {classes} = this.props
        
        if (this.state.isEditing) {
            return (            
                <EditSurvey 
                    edit={this.state.currentEdit}
                    handleEdit={this.handleEdit.bind(this)}
                    backAction={() => this.setState({isEditing: false, currentEdit: undefined})}
                />
            )
        }
        
        return (            
            <main className={classes.content}>
                <PageHeader title='ALL SURVEYS' paddingTop/>
                {this.renderContent()}
            </main>
        )
    }
}

const useStyles = theme => ({   
    content: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
		    marginLeft: -keys.NAV_WIDTH,
		},
    },
    noContentWrapper: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        padding: theme.spacing(3, 5),
        marginTop: theme.spacing(4)
    },    
    paginationWrapper: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    loading: {
        width: '100%',
        flexGrow: 1,
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseSurveys));