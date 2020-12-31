import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import EditBanner from './create';
import List from '../../components/banner/browse/list'
import PageHeader from '../../components/reusable/page-header'
import NoContent from '../../components/reusable/no-content'
import Spinner from '../../components/reusable/spinner'
import keys from '../../config/keys'

class BrowseBanners extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            banners: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentEdit: undefined
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchBanners(1)
    }
    
    fetchBanners(page) {
        const params = { page }
        axios.get(process.env.APP_URL + '/get-banners', {
            params,
            withCredentials: true
        }).then(res => {                        
            let result = res.data
            if (page > 1) {
                result.banners = [...this.state.banners, ...result.banners]
                this.setState({...result, isloading: false})
            } else {
                this.setState({...result, ...{ isLoading: false }})
            }
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get banners. Please try again later.")
            return err
        })
    }

    handleDelete(_id) {        
        const params = { _id }
        this.setState({isLoading:true})
        axios.post(process.env.APP_URL + '/delete-banner', params, {
            withCredentials: true
        })
        .then(() => {
            this.props.showToastAction(true, 'Banner deleted!', 'success')
            this.setState({isLoading:false})
            this.fetchBanners(this.state.page)
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't delete banner. Please try again later.`, 'error')
            this.setState({isLoading:false})            
        })
    }

    handleDuplicate(banner) {
        this.setState({isLoading:true})
        
        const lastChar = parseInt(banner.settings.name[banner.settings.name.length - 1])
        if (!isNaN(lastChar)) {
            banner.settings.name = banner.settings.name.slice(0, -1) + (lastChar+1)
        } else {
            banner.settings.name = banner.settings.name + " 2"
        }
        banner.views = 0
        banner.submits = 0
        banner.updatedAt = new Date()
        banner.createdAt = new Date()
        delete banner._id
        
        axios.post(process.env.APP_URL + '/create-banner', banner)
        .then(res => {
            this.fetchBanners(this.state.page)
            this.setState({isLoading: false})
            this.props.showToastAction(true, 'Banner copied!', 'success')
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't duplicate banner. Please try again later.`, 'error')
            this.setState({isLoading: false})
        })
    }

    handleEdit(data, callback) {
        axios.put(process.env.APP_URL + '/update-banner', data)
        .then(res => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, 'Banner edited!', 'success')
            this.updateBanner(res.data)
        }).catch(() => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, `Couldn't edit banner. Please try again later.`, 'error')
        })
    }
    
    //if a row is edited, goes through the current page array and updates the edited item with the new item
    updateBanner(newBanner) {        
        let banners = this.state.banners
        const index = banners.findIndex(d => d._id == newBanner._id)
        if (index < 0) return
        banners[index] = newBanner
        this.setState({banners})
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
        if (this.state.banners.length <= 0) {
            return (
                <div className={classes.noContentWrapper}>
                    <NoContent
                        iconPath="../../static/banner/add-image.svg"
                        text='Hey there,'
                        subText="It looks like you don't have a banner or a webpage set up yet. Let's create one now!"
                        actionText='Set up a Campaign'
                        footerText="Your campaigns wil show up here after creation."
                        action={() => {
                            window.location.replace(`${process.env.APP_URL}/banners/create`)
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
                fetch={this.fetchBanners.bind(this)}
                state={this.state} 
                setState={(state) => this.setState(state)}
            />  
        )
    }

    render() {
        const {classes} = this.props
        
        if (this.state.isEditing) {
            return (            
                <EditBanner 
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseBanners));