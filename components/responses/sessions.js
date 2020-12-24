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
import NoContent from '../../components/reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../../components/reusable/spinner'
import DetailModal from './detail-modal'
import SurveyResponses from './responses'

class SurveySessions extends React.Component {
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
        this.fetchSurveySessions(1)
    }

    fetchSurveySessions(page) {
        let params = {
            filter: {}
        }
        const {surveyId} = this.props
        surveyId ? params.filter.surveyId = surveyId : null

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
            this.props.showToastAction(true, "Couldn't get survey sessions. Please try again later.")
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
                    <TableCell size="small">Date</TableCell>
                    <TableCell size="small">SurveyName</TableCell>
                    <TableCell size="small">Browser</TableCell>
                    <TableCell size="small">Contact</TableCell>
                    <TableCell align="right" size="small">View</TableCell>
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
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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
                    let {_id, email, phone, browser, surveyName, createdAt} = row
                    const contact = email ? email : phone ? phone : 'N/A'
                    const created = formatDate(createdAt)
                    return (
                        <TableRow key={i}>
                            <TableCell size="small">{created}</TableCell>
                            <TableCell size="small">{surveyName}</TableCell>
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
                                        this.fetchSurveySessions(this.state.page + 1)
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
            tabs={['Responses']}
        >
            <SurveyResponses
                surveyId={this.props.surveyId}
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(SurveySessions));