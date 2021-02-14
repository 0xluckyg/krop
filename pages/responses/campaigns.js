import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import PageHeader from '../../components/reusable/page-header'
import keys from '../../config/keys'
import Campaigns from '../../components/responses/campaigns';
import CampaignSessions from '../../components/responses/sessions';
// import CampaignQuestions from '../../components/responses/questions';
// import CampaignResponses from '../../components/responses/responses';

let strings = new LocalizedStrings({
    en:{
        shoByLabel: "Show by",
        campaignsLabel: "Campaigns",
        sessionsLabel: "Sessions",
        campaignsTitle: "CAMPAIGNS"
    },
    kr: {
        shoByLabel: "종류",
        campaignsLabel: "캠페인",
        sessionsLabel: "세션",
        campaignsTitle: "캠페인"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

class CampaignResponses extends React.Component {
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
            filter: 'campaign'
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
                    <FormLabel component="legend">{strings.shoByLabel}</FormLabel>
                    <RadioGroup value={filter} onChange={(event) => this.handleFilterSwitch(event.target.value)}>
                        <FormControlLabel value="campaign" control={<Radio />} label={strings.campaignsLabel} />
                        <FormControlLabel value="session" control={<Radio />} label={strings.sessionsLabel} />
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
                    title={strings.campaignsTitle}
                    paddingTop
                />
                <Container className={classes.container} maxWidth={keys.CONTAINER_SIZE}>
                    {filter == 'campaign' ? <Campaigns/> : null}
                    {filter == 'session' ? <CampaignSessions/> : null}
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CampaignResponses));