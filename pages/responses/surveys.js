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
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import NoContent from '../../components/reusable/no-content'
import PageHeader from '../../components/reusable/page-header'
import keys from '../../config/keys'
import SurveyCampaigns from '../../components/responses/surveys';
import SurveyQuestions from '../../components/responses/questions';
import SurveyResponses from '../../components/responses/responses';
import Spinner from '../../components/reusable/spinner'

class Surveys extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            profiles: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentProfile: undefined,
            
            searchType: 'email',
            filter: 'question'
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
    }
    
    handleFilterSwitch(type) {
        this.setState({filter: type})
    }
    
    renderFilter() {
        const {classes} = this.props
        const filter = this.state.filter
        return(
            <div className={classes.filterContainer}>
                <FormControl>
                    <FormLabel component="legend">Show by</FormLabel>
                    <RadioGroup value={filter} onChange={(event) => this.handleFilterSwitch(event.target.value)}>
                        <FormControlLabel value="question" control={<Radio />} label="Questions" />
                        <FormControlLabel value="campaign" control={<Radio />} label="Campaigns" />
                        <FormControlLabel value="response" control={<Radio />} label="Responses" />
                    </RadioGroup>
                </FormControl>
            </div>
        )
    }

    render() {
        const {classes} = this.props
        const {filter} = this.state
        return (            
            <main className={classes.content}>   
                <PageHeader 
                    title='SURVEYS'
                    paddingTop
                />
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    <Paper className={classes.tablePaper}>                                    
                        {filter == 'question' ? <SurveyQuestions/> : null}
                        {filter == 'campaign' ? <SurveyCampaigns/> : null}
                        {filter == 'answer' ? <SurveyResponses/> : null}
                    </Paper>
                    <Paper className={classes.filterPaper}>
                        {this.renderFilter()}
                    </Paper>
                </Container>
            </main>
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
        // marginTop: 30
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Surveys));