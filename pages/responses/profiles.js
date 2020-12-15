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

import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import NoContent from '../../components/reusable/no-content'
import PageHeader from '../../components/reusable/page-header'
import keys from '../../config/keys'
import ProfileDetail from '../../components/responses/profile-detail';
import Spinner from '../../components/reusable/spinner'

class BrowseProfiles extends React.Component {
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
            filter: {
                email: false,
                mobile: false
            }
        }
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchProfiles(1)
    }

    fetchProfiles(page, params) {
        if (!params) {
            const { filter, searchText, searchType } = this.state
            params = { filter, searchText, searchType }
        }
        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-profiles', {
            params,
            withCredentials: true
        }).then(res => {                        
            const result = res.data
            this.setState({...result, ...{ isLoading: false }})
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get profiles. Please try again later.")
            return err
        })
    }

    handleDelete(_id) {      
        const params = { _id }
        this.setState({isLoading:true})
        axios.post(process.env.APP_URL + '/delete-profile', params, {
            withCredentials: true
        })
        .then(() => {
            this.props.showToastAction(true, 'Profile deleted!', 'success')
            this.setState({isLoading:false})
            this.fetchProfiles(this.state.page)
        }).catch(() => {
            this.props.showToastAction(true, `Couldn't delete profile. Please try again later.`, 'error')
            this.setState({isLoading:false})            
        })
    }

    //handleEdit is passed on as a prop to /profiles/create modal that pops up when edit icon is clicked
    handleEdit(data, callback) {
        this.setState({isLoading:true})
        axios.put(process.env.APP_URL + '/update-profile', data)
        .then(res => {
            //this callback stops button spinner
            callback()
            if (res.data == 'ineligible') {
                this.setState({isLoading:false})
                return this.props.showPaymentPlanAction(true, 'Please subscribe to our special plan to edit profiles!')
            } 
            
            this.setState({isLoading:false, isEditing: false, currentProfile: undefined})
            this.props.showToastAction(true, 'Profile edited!', 'success')
            this.updateProfile(data)
        }).catch(() => {
            callback()
            this.setState({isLoading:false})
            this.props.showToastAction(true, `Couldn't edit profile. Please try again later.`, 'error')
            this.updateProfile(data)
        })
    }
    
    //if a row is edited, goes through the current page array and updates the edited item with the new item
    updateProfile(newHeader) {        
        let profiles = this.state.profiles
        const index = profiles.findIndex(d => d._id == newHeader._id)
        if (index < 0) return
        profiles[index] = newHeader
        this.setState({profiles})
    }
    
    handleSearchTypeSelect(searchType) {
        this.setState({searchType})
    }
    
    handleSearchTextChange(searchText) {
        this.setState({searchText})
    }
    
    handleSearch() {
        this.fetchProfiles(1)
    }
    
    handleFilterSwitch(type) {
        let filter = {...this.state.filter}
        filter[type] = !filter[type]
        this.setState({filter})
        const {searchText, searchType} = this.state
        this.fetchProfiles(1, {filter, searchText, searchType})
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
                    <TableCell size="small">Email</TableCell>
                    <TableCell size="small">Name</TableCell>
                    <TableCell size="small">Number</TableCell>
                    <TableCell size="small">Signup Date</TableCell>
                    <TableCell align="right">View / Delete</TableCell>                    
                </TableRow>
            </TableHead>
        )
    }

    renderTablePagination() {        
        const {classes} = this.props;
        const { page, totalPages, hasPrevious, hasNext, isLoading } = this.state;
    
        const handleFirstPageButtonClick = () => {
            this.fetchProfiles(1)
        }
    
        const handleBackButtonClick = () => {
            this.fetchProfiles(page - 1)
        }
    
        const handleNextButtonClick = () => {
            this.fetchProfiles(page + 1)
        }
    
        const handleLastPageButtonClick = () => {
            this.fetchProfiles(totalPages)
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
        const {profiles, total, page} = this.state   
        const limit = keys.PAGE_SIZE
        return (
            <TableFooter>
                <TableRow>
                <TablePagination
                    rowsPerPageOptions={[]}                    
                    colSpan={6}
                    labelDisplayedRows={() => {
                        const current = (page * limit) - limit
                        return `${current + 1} - ${current + profiles.length} of ${total}`
                    }}
                    SelectProps={{
                        inputProps: { 'aria-label': 'Rows per page' },
                        native: true,
                    }}
                    rowsPerPage={limit}
                    page={0}
                    count={profiles.length}
                    onChangePage={() => {}}
                    ActionsComponent={this.renderTablePagination.bind(this)}
                />
                </TableRow>
            </TableFooter>
        )
    }

    renderTable() {
        //formats ISO date into a prettier format
        const formatDate = (ISO) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let date = new Date(Date.parse(ISO))
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
        }

        const formatName = (first, last) => {
            first = first ? first : ''
            last = last ? " " + last : ''
            return first + last
        }

        const {classes} = this.props
        const {profiles, isLoading} = this.state
        
        // if (true) {
        if (isLoading) {
            return (
                <div className={classes.emptyContainer}>
                    <Spinner/>
                </div>
            )
        } else if (profiles.length <= 0) {
            return this.renderNoContent()
        }
        
        return (
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {profiles.map((row, i) => {
                    let {_id, profile, email, mobile, createdAt} = row
                    email = email.value
                    mobile = mobile.value
                    const name = formatName(profile.firstName, profile.lastName)
                    const created = formatDate(createdAt)
                    return (
                        <TableRow key={i}>
                            <TableCell size="small">{email}</TableCell>
                            <TableCell size="small">{name}</TableCell>
                            <TableCell size="small">{mobile}</TableCell>
                            <TableCell size="small">{created}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => this.setState({
                                        isEditing: true,
                                        currentProfile: {...row,...row.content}
                                    })}
                                    disabled={isLoading}
                                    aria-label="Edit"
                                >                    
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={() => this.handleDelete(_id)}
                                    disabled={isLoading}
                                    aria-label="Delete"
                                >                    
                                    <DeleteIcon/>
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
    
    renderSearch() {
        const {classes} = this.props
        const searchTypes = [
            { value: "email", label: "Email" },
            { value: keys.MOBILE_PROPERTY, label: "Mobile" },
            { value: "firstName", label: "First Name"},
            { value: "lastName", label: "Last Name"},
            { value: "country", label: "Country"},
            { value: "state", label: "State"},
            { value: "city", label: "City"},
            { value: "organization", label: "Organization"}
        ]
        return (
            <div className={classes.searchContainer}>
                <InputLabel>Search</InputLabel>
                <Select
                    className={classes.searchType}
                    value={this.state.searchType}
                    onChange={(event) => this.handleSearchTypeSelect(event.target.value)}
                    inputProps={{
                        name: 'selector',
                        id: 'selector',
                    }}
                >
                    {searchTypes.map((type, i) => {
                        return <MenuItem 
                            key={i} 
                            value={type.value}>
                                {type.label}
                            </MenuItem>
                    })}
                </Select>
                <div className={classes.textFieldContainer}>
                    <TextField   
                        onChange={event => this.handleSearchTextChange(event.target.value)}
                        value={this.state.searchText}
                        className={classes.textFieldStyle}
                        label="Search"
                    />
                    <IconButton  
                        className={classes.iconButton} 
                        onClick={() => this.handleSearch()}
                        size="small" variant="contained">
                        <SearchIcon fontSize="small" />
                    </IconButton >
                </div>    
            </div>
        )
    }
    
    renderFilter() {
        const {classes} = this.props
        const filter = this.state.filter
        return(
            <div className={classes.filterContainer}>
                <InputLabel className={classes.filterLabel}>Filter</InputLabel>
                <FormGroup aria-label="type" name="type" 
                    value={filter.email} 
                    onChange={(event) => this.handleFilterSwitch("email")} row>
                    <FormControlLabel value={true} control={<Switch/>} label="Email" />
                </FormGroup>
                <FormGroup aria-label="type" name="type" 
                    value={filter.mobile} 
                    onChange={(event) => this.handleFilterSwitch(keys.MOBILE_PROPERTY)} row>
                    <FormControlLabel value={true} control={<Switch/>} label="Mobile" />
                </FormGroup>
            </div>
        )
    }

    render() {
        const {classes} = this.props

        if (this.state.isEditing) {
            return (            
                <ProfileDetail 
                    profile={this.state.currentProfile}
                    setProfile={(currentProfile) => this.setState({currentProfile})}
                    handleEdit={this.handleEdit.bind(this)}
                    backAction={() => this.setState({isEditing: false, currentProfile: undefined})}
                />
            )
        }
        return (            
            <main className={classes.content}>   
                <PageHeader 
                    title='PROFILES'
                    paddingTop
                />
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    <Paper className={classes.tablePaper}>                                    
                        {this.renderTable()}
                    </Paper>            
                    
                    <Paper className={classes.filterPaper}>
                        {this.renderSearch()}
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(BrowseProfiles));