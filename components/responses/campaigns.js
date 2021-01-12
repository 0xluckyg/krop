import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Waypoint } from "react-waypoint";

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

class Campaigns extends React.Component {
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
            params,
            withCredentials: true
        }).then(res => {                        
            let result = res.data
            result.campaigns = [...this.state.campaigns, ...result.campaigns]
            this.setState({...result, ...{ isLoading: false }})
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get campaign results. Please try again later.")
            return err
        })
    }

    renderNoContent() {        
        return (
            <div className={this.props.classes.emptyContainer}>
                <NoContent
                    iconPath="../../static/responses/market.svg"
                    text='Hey there,'
                    subText="It looks like you don't have a profile in your contacts!"
                    actionText='Set up a Campaign'
                    footerText="Your contacts will show up here after people register with your campaigns."
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
                    <TableCell size="small">Campaign Name</TableCell>
                    <TableCell size="small">Views</TableCell>
                    <TableCell size="small">Submits</TableCell>
                    <TableCell size="small">Updated At</TableCell>
                    <TableCell align="right">View</TableCell>
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
            tabs={['Responses', 'Sessions']}
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
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Campaigns));