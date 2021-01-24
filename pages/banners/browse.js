import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios'
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { showToastAction, isLoadingAction } from '../../redux/actions';
import EditBanner from './create';
import AddOrder from '../../components/banner/browse/order/add';
import CartPreview from '../../components/banner/browse/order/cart';
import List from '../../components/banner/browse/list'
import PageHeader from '../../components/reusable/page-header'
import NoContent from '../../components/reusable/no-content'
import Spinner from '../../components/reusable/spinner'
import keys from '../../config/keys'

let strings = new LocalizedStrings({
    en:{
        fetchError: "Couldn't get banners. Please try again later",
        deletedAlert: "Banner deleted!",
        deleteError: "Couldn't delete banner. Please try again later",
        copiedAlert: "Banner copied!",
        duplicateError: "Couldn't duplicate banner. Please try again later",
        editedAlert: "Banner edited!",
        editError: "Couldn't edit banner. Please try again later",
        tableStandBannerLabel: "TABLE STAND BANNERS",
        stickerBannerLabel: "STICKER BANNERES",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have a banner set up yet. Let's create one now!",
        noContentAction: "Set up a banner",
        noContentFooter: "Your campaigns will show up here after creation",
        tableStandLabel: "Table stand",
        stickerLabel: "Sticker"
    },
    kr: {
        fetchError: "배너들을 가지고 오지 못했어요. 잠시후 다시 시도해 주세요",
        deletedAlert: "배너를 지웠어요!",
        deleteError: "배너를 지우지 못했어요. 잠시후 다시 시도해 주세요",
        copiedAlert: "배너를 복사했어요!",
        duplicateError: "배너를 복사하지 못했어요. 잠시후 다시 시도해 주세요",
        editedAlert: "배너를 수정했어요!",
        editError: "배너를 수정하지 못했어요. 잠시후 다시 시도해 주세요",
        tableStandBannerLabel: "테이블 스탠딩 배너",
        stickerBannerLabel: "스티커 배너",
        noContentTitle: "흐음,",
        noContentSub: "아직 배너를 만들지 않으셨네요.",
        noContentAction: "배너 만들기",
        noContentFooter: "배너를 만드신 후 이곳에서 보실수 있어요",
        tableStandLabel: "스탠딩 배너",
        stickerLabel: "스티커"

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

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
            currentEdit: undefined,
            currentAdd: undefined,
            selectedType: 0,

            previewOrders: false,
            orders: {

            }
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchBanners(1)
    }
    
    fetchBanners(page) {
        const params = { page }
        axios.get(process.env.APP_URL + '/get-banners', {
            params
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
            this.props.showToastAction(true, strings.fetchError)
            return err
        })
    }

    handleDelete(_id) {        
        const params = { _id }
        this.setState({isLoading:true})
        axios.post(process.env.APP_URL + '/delete-banner', params)
        .then(() => {
            this.props.showToastAction(true, strings.deletedAlert, 'success')
            this.setState({isLoading:false})
            this.fetchBanners(this.state.page)
        }).catch(() => {
            this.props.showToastAction(true, strings.deleteError, 'error')
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
            this.props.showToastAction(true, strings.copiedAlert, 'success')
        }).catch((err) => {
            this.props.showToastAction(true, strings.duplicateError, 'error')
            this.setState({isLoading: false})
        })
    }

    handleEdit(data, callback) {
        axios.put(process.env.APP_URL + '/update-banner', data)
        .then(res => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, strings.editedAlert, 'success')
            this.updateBanner(res.data)
        }).catch(() => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, strings.editError, 'error')
        })
    }

    getTitle() {
        switch(this.state.selectedType) {
            case(0):
                return strings.tableStandBannerLabel
            case(1):
                return strings.stickerBannerLabel
            default:
                return ''
        }
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
                        text={strings.noContentTitle}
                        subText={strings.noContentSub}
                        actionText={strings.noContentAction}
                        footerText={strings.noContentFooter}
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

    renderTabs() {
        const {classes, state} = this.props
        return (<Tabs 
            className={classes.tabs}
            value={this.state.selectedType} 
            onChange={(event, newValue) => {
                this.setState({ selectedType: newValue })
            }} 
            aria-label="stage-bar"
            variant="scrollable"
            scrollButtons="auto"
        >
            <Tab label={strings.tableStandLabel} id={0}/>
            <Tab label={strings.stickerLabel} id={1}/>
        </Tabs>)
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
                <PageHeader title={this.getTitle()} paddingTop/>
                {/* {this.renderTabs()} */}
                <AddOrder
                    state={this.state}
                    setState={(state) => this.setState(state)}
                />
                <CartPreview
                    state={this.state} 
                    setState={(state) => this.setState(state)}
                />
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
    },
    tabs: {
        width: '100%'
    },
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseBanners));