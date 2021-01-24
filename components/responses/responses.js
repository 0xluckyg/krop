import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Waypoint } from "react-waypoint";
import LocalizedStrings from 'react-localization';

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

let strings = new LocalizedStrings({
    en:{
        fetchError: "Couldn't get campaign responses. Please try again later",
        noContentTitle: "Hey there,",
        noContentSub: "It looks like you don't have responses yet!",
        noContentFooterText: "Your responses will show up here after you create a campaign.",
        noContentActionText: "Create a campaign",
        emailLabel: "Email",
        phoneLabel: "Phone",
        outOfLabel: "Out of",
        toLabel: "to",
        addressLabel: "Address",
        nameLabel: "Name"
    },
    kr: {
        fetchError: "답변들을 찾을수 없었어요. 나중에 다시 시도해 주세요",
        noContentTitle: "흐음,",
        noContentSub: "아직 결과가 없네요!",
        noContentFooterText: "캠페인을 만든 후 조금만 기다리시면 답변들이 여기에 기록될 꺼에요.",
        noContentActionText: "캠페인 만들기",

        emailLabel: "이메일",
        phoneLabel: "번호",
        outOfLabel: "부터",
        toLabel: "중",
        addressLabel: "주소",
        nameLabel: "이름"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')


class CampaignResponses extends React.Component {
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
            currentCampaign: undefined,            
        }
    }

    formatDate(ISO) {
        const months = ["1", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12"]
        let date = new Date(Date.parse(ISO))
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`        
    }

    componentDidMount() {
        this.props.isLoadingAction(false)    
        this.fetchCampaignResponses(1)
    }

    fetchCampaignResponses(page) {
        let params = {
            filter: {}
        }
        const {campaignId, sessionId} = this.props
        campaignId ? params.filter.campaignId = campaignId : null
        sessionId ? params.filter.sessionId = sessionId : null

        params.page = page

        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/get-responses', {
            params
        }).then(res => {                        
            let result = res.data
            result.responses = [...this.state.responses, ...result.responses]
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
    
    renderSpinner() {
        if (!this.state.isLoading) return null
        return <div colSpan={5}>
            <Spinner margin={5} size={20}/>
        </div>
    }

    renderMultipleChoiceResponse(row) {
        let {question, value, options} = row
        return <div>
            <p className={this.props.classes.question}>{question}</p>
            {value.map((v, j)  => {
                return <p key={j} className={this.props.classes.answer}>{options[v]}</p>
            })}
        </div>
    }

    renderRatingResponse(row) {
        let {question, value, min, max} = row
        return <div>
            <p className={this.props.classes.question}>{question}</p>
            <p className={this.props.classes.answer}><b>{value}</b> ({min} {strings.toLabel} {max})</p>
        </div>
    }

    renderFormResponse(row) {
        let {question, value, type} = row
        question = type == keys.EMAIL_ELEMENT ? strings.emailLabel : type == keys.PHONE_ELEMENT ? strings.phoneLabel : question
        return <div>
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

    renderAddressResponse(row) {
        let {value} = row
        let address = this.formatAddress(value)
        return <div>
            <p className={this.props.classes.question}>{strings.addressLabel}</p>
            <p className={this.props.classes.answer}>{address}</p>
        </div>
    }

    renderNameResponse(row) {
        let {value} = row
        const {firstName, lastName} = value
        return <div>
            <p className={this.props.classes.question}>{strings.nameLabel}</p>
            <p className={this.props.classes.answer}>{firstName ? firstName + ' ': ''}{lastName ? lastName : ''}</p>
        </div>
    }   

    getIcon(icon) { 
        return (
            <Icon 
                path={icon}
                className={this.props.classes.mainIcon}
                size={0.9}
                color={keys.APP_COLOR_GRAY_DARKEST}
            />
        )
    }

    renderIcon(row) {
        let {type} = row

        const {classes} = this.props
        switch(type) {
            case (keys.MULTIPLE_CHOICE_ELEMENT):
                return this.getIcon(mdiCheckboxMarkedCircleOutline)
            case (keys.CHECKBOX_ELEMENT):
                return this.getIcon(mdiCheckboxMarkedOutline)
            case (keys.DROPDOWN_ELEMENT):
                return this.getIcon(mdiFormDropdown)
            case (keys.SLIDER_ELEMENT):
                return this.getIcon(mdiRayVertex)
            case (keys.FORM_ELEMENT):
            case (keys.EMAIL_ELEMENT):
            case (keys.PHONE_ELEMENT):
            case (keys.ADDRESS_ELEMENT):
            case (keys.NAME_ELEMENT):
                return this.getIcon(mdiFormTextbox)
            case (keys.LONG_FORM_ELEMENT):
                return this.getIcon(mdiFormTextarea)
        }
    }

    renderResponse(row) {
        let {type} = row
        switch(type) {
            case(keys.MULTIPLE_CHOICE_ELEMENT):
            case(keys.CHECKBOX_ELEMENT):
            case(keys.DROPDOWN_ELEMENT):
                return this.renderMultipleChoiceResponse(row)
            case(keys.SLIDER_ELEMENT):
                return this.renderRatingResponse(row)
            case(keys.FORM_ELEMENT):
            case(keys.LONG_FORM_ELEMENT):
            case(keys.PHONE_ELEMENT):
            case(keys.EMAIL_ELEMENT):
                return this.renderFormResponse(row)
            case(keys.ADDRESS_ELEMENT):
                return this.renderAddressResponse(row)
            case(keys.NAME_ELEMENT):
                return this.renderNameResponse(row)
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
                    return <div key={i} className={classes.responseContainer}>
                        {this.renderIcon(row)}
                        {this.renderResponse(row)}
                        {(i >= 50 && i == row.length - 1) ? 
                            <Waypoint
                                onEnter={() => {
                                    this.fetchCampaignResponses(this.state.page + 1)
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

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CampaignResponses));