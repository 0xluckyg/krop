import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import EditCampaign from './create';
import List from '../../components/campaign/browse/list'
import PageHeader from '../../components/reusable/page-header'
import NoContent from '../../components/reusable/no-content'
import Spinner from '../../components/reusable/spinner'
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    us:{
        fetchError: "Couldn't get campaigns. Please try again later",
        deletedAlert: "Campaign deleted!",
        deleteError: "Couldn't delete campaign. Please try again later",
        copiedAlert: "Campaign copied!",
        duplicateError: "Couldn't duplicate campaign. Please try again later",
        editedAlert: "Campaign edited!",
        editError: "Couldn't edit campaign. Please try again later",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have a campaign set up yet. Let's create one now!",
        noContentAction: "Set up a campaign",
        noContentFooter: "Your campaigns will show up here after creation",
        campaignLabel: "All campaigns"
    },
    kr: {
        fetchError: "캠페인들을 가지고 오지 못했어요. 잠시후 다시 시도해 주세요",
        deletedAlert: "캠페인를 지웠어요!",
        deleteError: "캠페인를 지우지 못했어요. 잠시후 다시 시도해 주세요",
        copiedAlert: "캠페인를 복사했어요!",
        duplicateError: "캠페인를 복사하지 못했어요. 잠시후 다시 시도해 주세요",
        editedAlert: "캠페인를 수정했어요!",
        editError: "캠페인를 수정하지 못했어요. 잠시후 다시 시도해 주세요",
        noContentTitle: "흐음,",
        noContentSub: "아직 캠페인를 만들지 않으셨네요.",
        noContentAction: "캠페인 만들기",
        noContentFooter: "캠페인를 만드신 후 이곳에서 보실수 있어요",
        campaignLabel: "모든 캠페인"

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class BrowseCampaigns extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            campaigns: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentEdit: undefined
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchCampaigns(1)
    }
    
    fetchCampaigns(page) {
        const params = { page }
        console.log("?: ", process.env.APP_URL)
        axios.get(process.env.APP_URL + '/get-campaigns', {
            params
        }).then(res => {              
            console.log("RES: ", res.data)          
            let result = res.data
            if (page > 1) {
                result.campaigns = [...this.state.campaigns, ...result.campaigns]
                this.setState({...result, isloading: false})
            } else {
                this.setState({...result, ...{ isLoading: false }})
            }
        }).catch(err => {
            console.log("WF: ", err)
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.fetchError, "error")
            return err
        })
    }

    handleDelete(_id) {        
        const params = { _id }
        this.setState({isLoading:true})
        axios.post(process.env.APP_URL + '/delete-campaign', params)
        .then(() => {
            this.props.showToastAction(true, strings.deletedAlert, 'success')
            this.setState({isLoading:false})
            this.fetchCampaigns(this.state.page)
        }).catch(() => {
            this.props.showToastAction(true, strings.deleteError, 'error')
            this.setState({isLoading:false})            
        })
    }

    handleDuplicate(campaign) {
        this.setState({isLoading:true})
        
        const lastChar = parseInt(campaign.settings.name[campaign.settings.name.length - 1])
        if (!isNaN(lastChar)) {
            campaign.settings.name = campaign.settings.name.slice(0, -1) + (lastChar+1)
        } else {
            campaign.settings.name = campaign.settings.name + " 2"
        }
        campaign.views = 0
        campaign.submits = 0
        campaign.updatedAt = new Date()
        campaign.createdAt = new Date()
        delete campaign._id
        
        axios.post(process.env.APP_URL + '/create-campaign', campaign)
        .then(res => {
            this.fetchCampaigns(this.state.page)
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.copiedAlert, 'success')
        }).catch(() => {
            this.props.showToastAction(true, strings.duplicateError, 'error')
            this.setState({isLoading: false})
        })
    }

    handleEdit(data, callback) {
        axios.put(process.env.APP_URL + '/update-campaign', data)
        .then(res => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, strings.editedAlert, 'success')
            this.updateCampaign(res.data)
        }).catch((err) => {
            callback()
            this.setState({isLoading:false})
            if (err.response && err.response.data) {
                return this.props.showToastAction(true, err.response.data)
            }
            this.props.showToastAction(true, strings.editError, 'error')
        })
    }
    
    //if a row is edited, goes through the current page array and updates the edited item with the new item
    updateCampaign(newCampaign) {        
        let campaigns = this.state.campaigns
        const index = campaigns.findIndex(d => d._id == newCampaign._id)
        if (index < 0) return
        campaigns[index] = newCampaign
        this.setState({campaigns})
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
        if (this.state.campaigns.length <= 0) {
            return (
                <div className={classes.noContentWrapper}>
                    <NoContent
                        iconPath="../../static/campaign/add-image.svg"
                        text={strings.noContentTitle}
                        subText={strings.noContentSub}
                        actionText={strings.noContentAction}
                        footerText={strings.noContentFooter}
                        action={() => {
                            window.location.replace(`${process.env.APP_URL}/campaigns/create`)
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
                fetch={this.fetchCampaigns.bind(this)}
                state={this.state} 
                setState={(state) => this.setState(state)}
            />  
        )
    }

    render() {
        const {classes} = this.props
        
        if (this.state.isEditing) {
            return (            
                <EditCampaign 
                    edit={this.state.currentEdit}
                    handleEdit={this.handleEdit.bind(this)}
                    backAction={() => this.setState({isEditing: false, currentEdit: undefined})}
                />
            )
        }
        
        return (            
            <main className={classes.content}>
                <PageHeader title={strings.campaignsLabel} paddingTop/>
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseCampaigns));