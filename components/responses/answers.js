import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import ViewIcon from '@material-ui/icons/Visibility';
import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import NoContent from '../../components/reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../../components/reusable/spinner'

class SurveyCampaigns extends React.Component {
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
            currentSurvey: undefined,
            
            searchType: 'email',
            filter: 'question'
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchSurveyQuestions(1)
    }

    fetchSurveyQuestions(page, params) {
        if (!params) {
            const { filter, searchText, searchType } = this.state
            params = { filter, searchText, searchType }
        }
        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-survey-responses', {
            params,
            withCredentials: true
        }).then(res => {                        
            const result = res.data
            console.log("result", result)
            this.setState({...result, ...{ isLoading: false }})
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get survey results. Please try again later.")
            return err
        })
    }

    renderNoContent() {        
        return (
            <div className={this.props.classes.emptyContainer}>
                <NoContent
                    iconPath="../../static/leads/market.svg"
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
                    <TableCell size="small">Questions</TableCell>
                    <TableCell size="small">Enabled</TableCell>
                    <TableCell size="small">Devices</TableCell>
                    <TableCell size="small">Updated At</TableCell>
                    <TableCell align="right">View</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    renderTablePagination() {        
        const {classes} = this.props;
        const { page, totalPages, hasPrevious, hasNext, isLoading } = this.state;
    
        const handleFirstPageButtonClick = () => {
            this.fetchSurveyQuestions(1)
        }
    
        const handleBackButtonClick = () => {
            this.fetchSurveyQuestions(page - 1)
        }
    
        const handleNextButtonClick = () => {
            this.fetchSurveyQuestions(page + 1)
        }
    
        const handleLastPageButtonClick = () => {
            this.fetchSurveyQuestions(totalPages)
        }        
            
        return (
            <div className={classes.paginationWrapper}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={!hasPrevious || isLoading}
                    aria-label="First Page"
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton 
                    onClick={handleBackButtonClick} 
                    disabled={!hasPrevious || isLoading} 
                    aria-label="Previous Page"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={!hasNext || isLoading}
                    aria-label="Next Page"
                >                    
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={!hasNext || isLoading}
                    aria-label="Last Page"
                >                    
                    <LastPageIcon/>
                </IconButton>
            </div>
        );
    }
    
    renderTableFooter() {
        const {surveys, total, page} = this.state   
        const limit = keys.PAGE_SIZE
        return (
            <TableFooter>
                <TableRow>
                <TablePagination
                    rowsPerPageOptions={[]}                    
                    colSpan={8}
                    labelDisplayedRows={() => {
                        const current = (page * limit) - limit
                        return `${current + 1} - ${current + surveys.length} of ${total}`
                    }}
                    SelectProps={{
                        inputProps: { 'aria-label': 'Rows per page' },
                        native: true,
                    }}
                    rowsPerPage={limit}
                    page={0}
                    count={surveys.length}
                    onChangePage={() => {}}
                    ActionsComponent={this.renderTablePagination.bind(this)}
                />
                </TableRow>
            </TableFooter>
        )
    }

    render() {
         //formats ISO date into a prettier format
        const formatDate = (ISO) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let date = new Date(Date.parse(ISO))
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
        }
        const {classes} = this.props
        const {surveys, isLoading} = this.state
        
        const handleEdit = (row) => {
            this.setState({
                isEditing: true,
                currentSurvey: {...row}
            })
        }
        
        if (isLoading) {
            return (
                <div className={classes.emptyContainer}>
                    <Spinner/>
                </div>
            )
        } else if (surveys.length <= 0) {
            return this.renderNoContent()
        }
        return (
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {surveys.map((row, i) => {
                    console.log("R: ", row)
                    let {name, views, submits, surveyCount, enabled, device, updatedAt} = row
                    return (
                        <TableRow onClick={() => handleEdit(row)} className={classes.tableRow} key={i}>
                            <TableCell size="small">{name}</TableCell>
                            <TableCell size="small">{views}</TableCell>
                            <TableCell size="small">{submits}</TableCell>
                            <TableCell size="small">{surveyCount}</TableCell>
                            <TableCell size="small">{enabled ? 'true' : 'false'}</TableCell>
                            <TableCell size="small">{device}</TableCell>
                            <TableCell size="small">{formatDate(updatedAt)}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => handleEdit(row)}
                                    disabled={isLoading}
                                    aria-label="Edit"
                                >                    
                                    <ViewIcon/>
                                </IconButton>
                            </TableCell>                                                              
                        </TableRow>
                    )}
                )}
                </TableBody>                                     
                {this.renderTableFooter()}
            </Table>
        )
    }
}

const useStyles = theme => ({    
    emptyContainer: {
        height: '100%',
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(SurveyCampaigns));