import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Waypoint } from "react-waypoint";
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/Visibility';
import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';

import NoContent from '../reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../reusable/spinner'
import DetailModal from './detail-modal'
import CampaignSessions from './sessions'
import CampaignResponses from './responses'

let strings = new LocalizedStrings({
    en:{
        fetchCampaignError: "Couldn't get campaign results. Please try again later",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have a campaign yet!",
        noContentActionText: "Set up a campaign",
        noContentFooterText: "Your campaigns will show up here after you create one.",
        campaignNameColumn: "Campaign name",
        viewsColumn: "Views",
        submitsColumn: "Submits",
        updatedAtColumn: "Updated at",
        viewColumn: "View",
        responsesTab: "Responses",
        sessionsTab: "Sessions"
    },
    kr: {
        fetchCampaignError: "캠페인들을 가져오지 못했어요. 나중에 다시 시도해 주세요",
        noContentTitle: "흐음,",
        noContentSub: "캠페인을 아직 안만드신것 같네요!",
        noContentActionText: "캠페인 만들으러 가기",
        noContentFooterText: "캠페인을 만든후 이곳에서 볼수 있어요.",
        campaignNameColumn: "캠페인 이름",
        viewsColumn: "캠페인 조회수",
        submitsColumn: "캠페인 작성수",
        updatedAtColumn: "업데이트 날짜",
        viewColumn: "보기",
        responsesTab: "답변",
        sessionsTab: "세션"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

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
            isViewing: false,
            currentCampaign: undefined,
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchCampaigns(1)
    }

    fetchCampaigns(page) {
        let params = {}
        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-campaigns', {
            params
        }).then(res => {                        
            let result = res.data
            result.campaigns = [...this.state.campaigns, ...result.campaigns]
            this.setState({...result, ...{ isLoading: false }})
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.fetchCampaignError)
            return err
        })
    }

    renderNoContent() {        
        return (
            <div className={this.props.classes.emptyContainer}>
                <NoContent
                    iconPath="../../static/responses/market.svg"
                    text={strings.noContentTitle}
                    subText={strings.noContentSub}
                    actionText={strings.noContentActionText}
                    footerText={strings.noContentFooterText}
                    action={() => {
                        window.location.replace(`${process.env.APP_URL}/widgets/create`)
                    }}
                />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <TableHead>
                <TableRow>
                    <TableCell size="small">{strings.campaignNameColumn}</TableCell>
                    <TableCell size="small">{strings.viewsColumn}</TableCell>
                    <TableCell size="small">{strings.submitsColumn}</TableCell>
                    <TableCell size="small">{strings.updatedAtColumn}</TableCell>
                    <TableCell align="right">{strings.viewColumn}</TableCell>
                </TableRow>
            </TableHead>
        )
    }
    
    renderSpinner() {
        const SpinnerCell = withStyles({
            root: {
                borderBottom: "none"
            }
        })(TableCell);
        if (!this.state.isLoading) return null
        return <SpinnerCell colSpan={5}>
            <Spinner margin={5} size={20}/>
        </SpinnerCell>
    }

    renderCampaignDetail() {
        const {currentCampaign} = this.state
        if (!currentCampaign) return null
        return (<DetailModal 
            close={() => {
                this.setState({
                    isViewing: false,
                    currentCampaign: null
                })
            }} 
            detail={currentCampaign}
            tabs={[strings.responsesTab, strings.sessionsTab]}
        >
            <CampaignResponses
                campaignId={currentCampaign._id}
            />
            <CampaignSessions
                campaignId={currentCampaign._id}
            />
        </DetailModal>)
    }

    render() {
         //formats ISO date into a prettier format
        const formatDate = (ISO) => {
            const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
            let date = new Date(Date.parse(ISO))
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
        }
        const {classes} = this.props
        const {campaigns, isLoading} = this.state
        
        const handleView = (row) => {
            this.setState({
                isViewing: true,
                currentCampaign: {...row}
            })
        }
        
        if (!isLoading && campaigns.length <= 0) {
            return this.renderNoContent()
        }
        return (
            <React.Fragment>
            {this.renderCampaignDetail()}
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {campaigns.map((row, i) => {
                        let {views, submits, updatedAt} = row
                        let {name} = row.settings
                        return (
                            <TableRow onClick={() => handleView(row)} className={classes.tableRow} key={i}>
                                <TableCell size="small">{name}</TableCell>
                                <TableCell size="small">{views}</TableCell>
                                <TableCell size="small">{submits}</TableCell>
                                <TableCell size="small">{formatDate(updatedAt)}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleView(row)}
                                        disabled={isLoading}
                                        aria-label="View"
                                    >                    
                                        <ViewIcon/>
                                    </IconButton>
                                </TableCell>
                                {(i >= 50 && i == row.length - 1) ? 
                                    <Waypoint
                                        onEnter={() => {
                                            this.fetchCampaigns(this.state.page + 1)
                                        }}
                                    />
                                    : null
                                }
                            </TableRow>
                        )}
                    )}
                    {this.renderSpinner()}
                </TableBody>                                     
            </Table>
            </React.Fragment>
        )
    }
}

const useStyles = theme => ({    
    emptyContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spinnerContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    tableRow: {
        transition: '0.2s',
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
            cursor: 'pointer',
            transition: '0.2s'
        }  
    },
    paginationWrapper: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, showPaymentPlanAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseCampaigns));