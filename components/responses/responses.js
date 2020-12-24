import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Waypoint } from "react-waypoint";

import { withStyles } from '@material-ui/core/styles';
import { showToastAction, isLoadingAction, showPaymentPlanAction } from '../../redux/actions';
import NoContent from '../../components/reusable/no-content'
import keys from '../../config/keys'
import Spinner from '../../components/reusable/spinner'
import Icon from '@mdi/react';
import { 
    mdiCheckboxMarkedOutline,
    mdiCheckboxMarkedCircleOutline,
    mdiFormDropdown,
    mdiRayVertex,
    mdiFormTextbox,
    mdiFormTextarea
} from '@mdi/js';

class SurveyResponses extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page: 1,
            total: 0,
            totalPages: 0,
            responses: [],
            hasPrevious: false,
            hasNext: false,
            isLoading: true,
            isEditing: false,
            currentSurvey: undefined,            
        }
    }

    formatDate(ISO) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let date = new Date(Date.parse(ISO))
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchSurveyResponses(1)
    }

    fetchSurveyResponses(page) {
        let params = {
            filter: {}
        }
        const {surveyId, sessionId} = this.props
        surveyId ? params.filter.surveyId = surveyId : null
        sessionId ? params.filter.sessionId = sessionId : null

        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-responses', {
            params,
            withCredentials: true
        }).then(res => {                        
            let result = res.data
            result.responses = [...this.state.responses, ...result.responses]
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
                    footerText="Your contacts will show up here after people register with your campaigns."
                    action={() => {
                        window.location.replace(`${process.env.APP_URL}/widgets/create`)
                    }}
                />
            </div>
        )
    }
    
    renderSpinner() {
        if (!this.state.isLoading) return null
        return <div colSpan={5}>
            <Spinner margin={5} size={20}/>
        </div>
    }

    renderMultipleChoiceResponse(row, i) {
        let {updatedAt, question, value, type, options, device, browser} = row
        return <div key={i}>
            <p className={this.props.classes.question}>{question}</p>
            {value.map((v, j)  => {
                return <p className={this.props.classes.answer}>{options[v]}</p>
            })}
        </div>
    }

    renderRatingResponse(row, i) {
        let {updatedAt, question, value, min, max, type, device, browser} = row
        return <div key={i}>
            <p className={this.props.classes.question}>{question}</p>
            <p className={this.props.classes.answer}><b>{value}</b> out of {min} to {max}</p>
        </div>
    }

    renderFormResponse(row, i) {
        let {updatedAt, question, value, type, device, browser} = row
        question = type == keys.EMAIL_ELEMENT ? 'Email' : type == keys.PHONE_ELEMENT ? 'Phone' : question
        return <div key={i}>
            <p className={this.props.classes.question}>{question}</p>
            <p className={this.props.classes.answer}>{value}</p>
        </div>
    }

    formatAddress(address) {
        let addressArray = []
        let {address1, address2, city, state, country, zip} = address
        address1 ? addressArray.push(address1) : null
        address2 ? addressArray.push(address2) : null
        city ? addressArray.push(city) : null
        state ? addressArray.push(state) : null
        country ? addressArray.push(country) : null
        zip ? addressArray.push(zip) : null

        return addressArray.join(', ')
    }

    renderAddressResponse(row, i) {
        let {updatedAt, value, type, device, browser} = row
        let address = this.formatAddress(value)
        return <div key={i}>
            <p className={this.props.classes.question}>Address</p>
            <p className={this.props.classes.answer}>{address}</p>
        </div>
    }

    renderNameResponse(row, i) {
        let {updatedAt, question, value, type, options, device, browser} = row
        const {firstName, lastName} = value
        return <div key={i}>
            <p className={this.props.classes.question}>Name</p>
            <p className={this.props.classes.answer}>{firstName ? firstName + ' ': ''}{lastName ? lastName : ''}</p>
        </div>
    }   

    getIcon(icon, i) { 
        return (
            <Icon 
                key={i}
                path={icon}
                className={this.props.classes.mainIcon}
                size={0.9}
                color={keys.APP_COLOR_GRAY_DARKEST}
            />
        )
    }

    renderIcon(row, i) {
        let {type} = row

        const {classes} = this.props
        switch(type) {
            case (keys.MULTIPLE_CHOICE_ELEMENT):
                return this.getIcon(mdiCheckboxMarkedCircleOutline, i)
            case (keys.CHECKBOX_ELEMENT):
                return this.getIcon(mdiCheckboxMarkedOutline, i)
            case (keys.DROPDOWN_ELEMENT):
                return this.getIcon(mdiFormDropdown, i)
            case (keys.SLIDER_ELEMENT):
                return this.getIcon(mdiRayVertex, i)
            case (keys.FORM_ELEMENT):
            case (keys.EMAIL_ELEMENT):
            case (keys.PHONE_ELEMENT):
            case (keys.ADDRESS_ELEMENT):
            case (keys.NAME_ELEMENT):
                return this.getIcon(mdiFormTextbox, i)
            case (keys.LONG_FORM_ELEMENT):
                return this.getIcon(mdiFormTextarea, i)
        }
    }

    renderResponse(row, i) {
        let {type} = row
        switch(type) {
            case(keys.MULTIPLE_CHOICE_ELEMENT):
            case(keys.CHECKBOX_ELEMENT):
            case(keys.DROPDOWN_ELEMENT):
                return this.renderMultipleChoiceResponse(row, i)
            case(keys.SLIDER_ELEMENT):
                return this.renderRatingResponse(row, i)
            case(keys.FORM_ELEMENT):
            case(keys.LONG_FORM_ELEMENT):
            case(keys.PHONE_ELEMENT):
            case(keys.EMAIL_ELEMENT):
                return this.renderFormResponse(row, i)
            case(keys.ADDRESS_ELEMENT):
                return this.renderAddressResponse(row, i)
            case(keys.NAME_ELEMENT):
                return this.renderNameResponse(row, i)
        }
    }

    render() {
        const {responses, isLoading} = this.state
        const {classes} = this.props
        if (!isLoading && responses.length <= 0) {
            return this.renderNoContent()
        }
        return (
            <div className={classes.responses}>
                {responses.map((row, i) => {
                    return <div className={classes.responseContainer}>
                        {this.renderIcon(row, i)}
                        {this.renderResponse(row, i)}
                        {(i >= 50 && i == row.length - 1) ? 
                            <Waypoint
                                onEnter={() => {
                                    this.fetchSurveyResponses(this.state.page + 1)
                                }}
                            />
                            : null
                        }
                    </div>
                })}
                {this.renderSpinner()}
            </div>           
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
    mainIcon: {
        color: keys.APP_COLOR_GRAY_DARKEST,
        margin: '0px 15px'
    },
    responses: {
        margin: '0px 0px 0px 30px',
        paddingTop: 30,
        flex: 1,
        overflowY: 'auto'
    },
    responseContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 30
    },
    question: {
        margin: 0,
        fontWeight: 500
    },
    answer: {
        margin: '10px 0px 0px 0px',
        backgroundColor: keys.APP_COLOR_GRAY,
        padding: '5px 10px',
        borderRadius: 3,
        color: keys.APP_COLOR_GRAY_DARKEST
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, showPaymentPlanAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(SurveyResponses));