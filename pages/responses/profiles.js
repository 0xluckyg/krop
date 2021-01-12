import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Waypoint } from "react-waypoint";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
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
import ProfileDetail from '../../components/responses/profile';
import Spinner from '../../components/reusable/spinner'
import DetailModal from '../../components/responses/detail-modal'
import CampaignResponses from '../../components/responses/responses'

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
                phone: false
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
        axios.post(process.env.APP_URL + '/remove-profile', params, {
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
        this.setState({
            profiles
        })
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
                    <TableCell size="small">Email</TableCell>
                    <TableCell size="small">Phone</TableCell>
                    <TableCell size="small">Name</TableCell>
                    <TableCell size="small">Signup Date</TableCell>
                    <TableCell align="right">View / Delete</TableCell>                    
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
        return <TableRow><SpinnerCell colSpan={5}>
            <Spinner margin={5} size={20}/>
        </SpinnerCell></TableRow>
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
        if (!isLoading && profiles.length <= 0) {
            return this.renderNoContent()
        }
        
        return (
            <Table className={classes.table}>
                {this.renderTableHeader()}
                <TableBody>
                    {profiles.map((row, i) => {
                    let {_id, email, phone, name, createdAt} = row
                    const cleanName = name ? formatName(name.firstName, name.lastName) : ''
                    const created = formatDate(createdAt)
                    return (
                        <TableRow key={i}>
                            <TableCell size="small">{email}</TableCell>
                            <TableCell size="small">{phone}</TableCell>
                            <TableCell size="small">{cleanName}</TableCell>
                            <TableCell size="small">{created}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => this.setState({
                                        isEditing: true,
                                        currentProfile: {...row}
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
                            {(i >= 50 && i == row.length - 1) ? 
                                <Waypoint
                                    onEnter={() => {
                                        this.fetchProfiles(this.state.page + 1)
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
    
    renderSearch() {
        const {classes} = this.props
        const searchTypes = [
            { value: keys.EMAIL_ELEMENT, label: "Email" },
            { value: keys.PHONE_ELEMENT, label: "Phone" },
            
            { value: "name.firstName", label: "First Name"},
            { value: "name.lastName", label: "Last Name"},
            
            { value: "address.country", label: "Country"},
            { value: "address.state", label: "State"},
            { value: "address.city", label: "City"},
            { value: "address.zip", label: "Zip"},
            { value: "address.address1", label: "Address 1"},
            { value: "address.address2", label: "Address 2"},
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
                    value={filter.phone} 
                    onChange={(event) => this.handleFilterSwitch(keys.PHONE_ELEMENT)} row>
                    <FormControlLabel value={true} control={<Switch/>} label="Phone" />
                </FormGroup>
                <FormGroup aria-label="type" name="type" 
                    value={filter.name} 
                    onChange={(event) => this.handleFilterSwitch("name")} row>
                    <FormControlLabel value={true} control={<Switch/>} label="Name" />
                </FormGroup>
                <FormGroup aria-label="type" name="type" 
                    value={filter.address} 
                    onChange={(event) => this.handleFilterSwitch("address")} row>
                    <FormControlLabel value={true} control={<Switch/>} label="Address" />
                </FormGroup>
            </div>
        )
    }

    renderProfileDetail() {
        const {currentProfile} = this.state
        if (!currentProfile) return null
        return (<DetailModal 
            close={() => {
                this.setState({
                    isViewing: false,
                    currentProfile: null
                })
            }} 
            detail={currentProfile}
            tabs={['Profile', 'Responses']}
        >
            <ProfileDetail 
                profile={this.state.currentProfile}
                handleEdit={this.handleEdit.bind(this)}
                backAction={() => this.setState({isEditing: false, currentProfile: undefined})}
            />
            <CampaignResponses
                sessionId={currentProfile.sessionId}
            />
        </DetailModal>)
    }

    render() {
        const {classes} = this.props
        return (            
            <main className={classes.content}>   
                {this.renderProfileDetail()}
                <PageHeader 
                    title='PROFILES'
                    paddingTop
                />
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    {this.renderTable()}
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
        width: '100%',
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