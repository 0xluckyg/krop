import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import keys from '../../config/keys'

//A pop up to ask users to login or signup
class DetailModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            selectedTab: 0
        }
    }

    renderTabs() {
        const {classes, tabs} = this.props
        return (<Tabs 
            className={classes.tabs}
            value={this.state.selectedTab} 
            onChange={(e, selectedTab) => {
                this.setState({selectedTab})
            }} 
            variant="scrollable"
            scrollButtons="auto"
        >
            {tabs.map((tab, index) => {
                return <Tab label={tab} key={index} id={index}/>
            })}
        </Tabs>)
    }

    render() {
        const { classes, detail, close, children } = this.props;
        console.log("C: ", children)
        return(
            <Modal 
                style={{zIndex: 9999999}}
                open={detail ? true : false}
                onClose={() => {
                    close()
                    this.setState({selectedTab: 0})
                }}
            >
                <div className={classes.paper}>
                    {this.renderTabs()}
                    {children.length > 0 ? children[this.state.selectedTab] : children}
                </div>
            </Modal>
        )
    }
}

const useStyles = theme => ({
    paper: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: 5,
        outline: 'none',
        [theme.breakpoints.up('sm')]: {
			position: 'absolute',
            width: 700,
            height: '90%',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            borderRadius: 5,
            outline: 'none',
		}
    },
    tabs: {
        width: '100%',
        marginBottom: 10
    }
});

export default withStyles(useStyles)(DetailModal);