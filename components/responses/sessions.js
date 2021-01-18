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
import NoContent from '../../components/reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../../components/reusable/spinner'
import DetailModal from './detail-modal'
import CampaignResponses from './responses'

let strings = new LocalizedStrings({
    en:{
        fetchError: "Couldn't get campaign sessions. Please try again later",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have sessions yet!",
        noContentFooterText: "Your sessions will show up here after you create a campaign.",
        noContentActionText: "Create a campaign",
        dateLabel: "Date",
        campaignNameLabel: "Campaign name",
        browserLabel: "Browser",
        contactLabel: "Contact",
        viewLabel: "View",
        NALabel: "N/A",
        responsesTab: "Responses"
    },
    kr: {
        fetchError: "세션을 찾을수 없었어요. 나중에 다시 시도해 주세요",
        noContentTitle: "흐음,",
        noContentSub: "아직 결과가 없네요!",
        noContentFooterText: "캠페인을 만든 후 조금만 기다리시면 세션이 여기에 기록될 꺼에요.",
        noContentActionText: "캠페인 만들기",
        dateLabel: "날짜",
        campaignNameLabel: "캠페인 이름",
        browserLabel: "브라우저",
        contactLabel: "연락처",
        viewLabel: "보기",
        NALabel: "없음",
        responsesTab: "답변"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'en')

class CampaignSessions extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            sessions: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentSession: undefined,            
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchCampaignSessions(1)
    }

    fetchCampaignSessions(page) {
        let params = {
            filter: {}
        }
        const {campaignId} = this.props
        campaignId ? params.filter.campaignId = campaignId : null

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-sessions', {
            params,
            withCredentials: true
        }).then(res => {                
            let result = res.data
            result.sessions = [...this.state.sessions, ...result.sessions]
            this.setState({...result, ...{ isLoading: false }})
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, strings.fetchError)
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
                    <TableCell size="small">{strings.dateLabel}</TableCell>
                    <TableCell size="small">{strings.campaignNameLabel}</TableCell>
                    <TableCell size="small">{strings.browserLabel}</TableCell>
                    <TableCell size="small">{strings.contactLabel}</TableCell>
                    <TableCell align="right" size="small">{strings.viewLabel}</TableCell>
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

    renderTable() {
        //formats ISO date into a prettier format
        const formatDate = (ISO) => {
            const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
            let date = new Date(Date.parse(ISO))
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
        }
        
        const {classes} = this.props
        const {sessions, isLoading} = this.state
        
        const handleView = (row) => {
            this.setState({
                isViewing: true,
                currentSession: {...row}
            })
        }
        
        if (!isLoading && sessions.length <= 0) {
            return this.renderNoContent()
        }
        
        return (
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {sessions.map((row, i) => {
                    let {_id, email, phone, browser, campaignName, createdAt} = row
                    const contact = email ? email : phone ? phone : strings.NALabel
                    const created = formatDate(createdAt)
                    return (
                        <TableRow key={i}>
                            <TableCell size="small">{created}</TableCell>
                            <TableCell size="small">{campaignName}</TableCell>
                            <TableCell size="small">{browser}</TableCell>
                            <TableCell size="small">{contact}</TableCell>
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
                                        this.fetchCampaignSessions(this.state.page + 1)
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
        )
    }

    renderSessionDetail() {
        const {currentSession} = this.state
        if (!currentSession) return null
        return (<DetailModal 
            close={() => {
                this.setState({
                    isViewing: false,
                    currentSession: null
                })
            }} 
            detail={currentSession}
            tabs={[strings.responsesTab]}
        >
            <CampaignResponses
                campaignId={this.props.campaignId}
                sessionId={currentSession.sessionId}
            />
        </DetailModal>)
    }

    render() {
        const {classes} = this.props

        return (
            <React.Fragment>
                {this.renderSessionDetail()}
                <Table className={classes.table}>
                    {this.renderTable()}                              
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CampaignSessions));