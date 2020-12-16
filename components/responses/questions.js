import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
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
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import NoContent from '../../components/reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../../components/reusable/spinner'

class SurveyQuestions extends React.Component {
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
        axios.get(process.env.APP_URL + '/get-survey-questions', {
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
                    <TableCell size="small">Question</TableCell>
                    <TableCell size="small">Campaign Name</TableCell>
                    <TableCell size="small">Survey Type</TableCell>
                    <TableCell size="small">Created Date</TableCell>
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
                    colSpan={6}
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
        
        const formatSurveyType = (type) => {
            switch(type) {
                case(keys.MULTIPLE_CHOICE):
                    return 'Multiple Choice / Checkbox'
                case(keys.SLIDER):
                    return 'Slider'
                case(keys.SELECTOR):
                    return 'Option Selector'
                case(keys.TEXTAREA):
                    return 'Long Form'
            }
        }
        
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
                    let {campaignName, type, question, createdAt} = row
                    return (
                        <TableRow onClick={() => handleEdit(row)} className={classes.tableRow} key={i}>
                            <TableCell size="small">{question}</TableCell>
                            <TableCell size="small">{campaignName}</TableCell>
                            <TableCell size="small">{formatSurveyType(type)}</TableCell>
                            <TableCell size="small">{formatDate(createdAt)}</TableCell>
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
    content: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    emptyContainer: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        flex: 1
    },
    tablePaper: {
        flex: 1,
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
    },
    
    filterPaper: {
        width: 300,
        marginLeft: 30,
        padding: '20px 20px',
        height: 'max-content'
    },
    searchType: {
        margin: '15px 0px 5px 0px',
        width: '100%'  
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: '2px', 
        width: '100%'
    },
    textFieldStyle: {
        flex: 1
    },
    iconContainer: {
         marginLeft: 3
    },
    iconButton: {
        height: 30,
        width: 30
    },
    
    filterContainer: {
        marginTop: 30
    },
    filterLabel: {
        marginBottom: 10  
    }
    
    
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, showPaymentPlanAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(SurveyQuestions));