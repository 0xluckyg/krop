import React from 'react';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';

import keys from '../../config/keys'
import Spinner from '../reusable/spinner';
import NoContent from '../reusable/no-content';

let strings = new LocalizedStrings({
    en:{
        noContentTitle: "Hey there,",
        noContentSub: "It looks like there isn't any template matching your search!",
        noContentActionText: "Reset search",
        noContentFooterText: "We're constantly designing new contents, so keep updated!",
    },
    kr: {
        noContentTitle: "흐음,",
        noContentSub: "서치에 알맞는 템플릿을 찾지 못했어요!",
        noContentActionText: "초기화",
        noContentFooterText: "저희 팀은 항상 새로운 디자인을 준비하도록 노력하겠습니다.",
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'kr')

class List extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    renderNoContent() {        
        return (
            <NoContent
                iconPath="../../../../static/app/edit-tools.svg"
                text={strings.noContentTitle}
                subText={strings.noContentSub}
                actionText={strings.noContentActionText}
                footerText={strings.noContentFooterText}
                action={() => {
                    this.props.setState({searchText: ''})
                    this.props.fetchTemplates({page: 1})
                }}
            />
        )
    }
    
    renderCards() {
        const {state, setState, category, handleScroll} = this.props
        const {templates} = state
        return <category.render
                    handleScroll={handleScroll}
                    state={state}
                    setState={setState}
                    templates={templates}
                    category={category}
                />
    }
    
    render() {
        const {classes, state} = this.props
        const {isLoading, templates} = state

        if (isLoading) {
            return <div className={classes.emptyContainer}>
                <Spinner/>
            </div>
        } else if (templates.length <= 0) {
            return <div className={classes.emptyContainer}>
                {this.renderNoContent()}
            </div>
        }
        
        return (
            this.renderCards()
        );
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
    list: {
        height: '100%',
        width: '100%',
        padding: 30,
        // display: 'grid',
        // gridGap: '10px',
        // gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        // gridAutoRows: 'minmax(50px, auto)',
        // justifyItems: 'center'
    },
});

export default withStyles(useStyles)(List)