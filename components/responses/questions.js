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

let strings = new LocalizedStrings({
    us:{
        fetchError: "Couldn't get questions. Please try again later",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have questions yet!",
        noContentActionText: "Set up a campaign",
        noContentFooterText: "Your question will show up here after you create a survey campaign.",
        campaignNameLabel: "Campaign name",
        viewsLabel: "Views",
        submitsLabel: "Submits",
        questionsLabel: "Questions",
        enabledLabel: "Enabled",
        devicesLabel: "Devices",
        updatedAtLabel: "Updated at",
        viewLabel: "View",
        editLabel: "Edit"
    },
    kr: {
        fetchError: "질문들을 가져올수 없었어요. 잠시후 다시 시도해 주세요.",
        noContentTitle: "흐음,",
        noContentSub: "아직 질문들을 만들지 않으셨네요!",
        noContentActionText: "캠페인 만들으러 가기",
        noContentFooterText: "설문 캠페인을 만드시면 여기서 질문들을 보실수 있어요.",
        campaignNameLabel: "캠페인 이름",
        viewsLabel: "조회수",
        submitsLabel: "작성수",
        questionsLabel: "질문",
        enabledLabel: "활성화",
        devicesLabel: "기기",
        updatedAtLabel: "수정 날짜",
        viewLabel: "보기",
        editLabel: "수정"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')


class CampaignQuestions extends React.Component {
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
            currentCampaign: undefined,
            
            searchType: 'email',
            filter: 'question'
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchCampaignQuestions(1)
    }

    fetchCampaignQuestions(page, params) {
        if (!params) {
            const { filter, searchText, searchType } = this.state
            params = { filter, searchText, searchType }
        }
        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-questions', {
            params
        }).then(res => {                        
            const result = res.data
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
                    <TableCell size="small">{strings.campaignNameLabel}</TableCell>
                    <TableCell size="small">{strings.viewsLabel}</TableCell>
                    <TableCell size="small">{strings.submitsLabel}</TableCell>
                    <TableCell size="small">{strings.questionsLabel}</TableCell>
                    <TableCell size="small">{strings.enabledLabel}</TableCell>
                    <TableCell size="small">{strings.devicesLabel}</TableCell>
                    <TableCell size="small">{strings.updatedAtLabel}</TableCell>
                    <TableCell align="right">{strings.viewLabel}</TableCell>
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

    render() {
         //formats ISO date into a prettier format
        const formatDate = (ISO) => {
            const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
            let date = new Date(Date.parse(ISO))
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
        }
        const {classes} = this.props
        const {campaigns, isLoading} = this.state
        
        const handleEdit = (row) => {
            this.setState({
                isEditing: true,
                currentCampaign: {...row}
            })
        }
        
        if (!isLoading && campaigns.length <= 0) {
            return this.renderNoContent()
        }
        return (
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {campaigns.map((row, i) => {
                    let {name, views, submits, campaignCount, enabled, device, updatedAt} = row
                    return (
                        <TableRow onClick={() => handleEdit(row)} className={classes.tableRow} key={i}>
                            <TableCell size="small">{name}</TableCell>
                            <TableCell size="small">{views}</TableCell>
                            <TableCell size="small">{submits}</TableCell>
                            <TableCell size="small">{campaignCount}</TableCell>
                            <TableCell size="small">{enabled ? 'true' : 'false'}</TableCell>
                            <TableCell size="small">{device}</TableCell>
                            <TableCell size="small">{formatDate(updatedAt)}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => handleEdit(row)}
                                    disabled={isLoading}
                                    aria-label={strings.editLabel}
                                >                    
                                    <ViewIcon/>
                                </IconButton>
                            </TableCell>
                            {(i >= 50 && i == row.length - 1) ? 
                                <Waypoint
                                    onEnter={() => {
                                        this.fetchCampaignQuestions(this.state.page + 1)
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CampaignQuestions));