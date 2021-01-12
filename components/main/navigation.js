import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WidgetBrowseIcon from '@material-ui/icons/WebAsset';
import StoreIcon from '@material-ui/icons/Store';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactIcon from '@material-ui/icons/Mail';
import ProfileIcon from '@material-ui/icons/PersonPin';
import CampaignIcon from '@material-ui/icons/DonutSmall';
import CropFreeIcon from '@material-ui/icons/CropFree';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';

import {showPaymentPlanAction} from '../../redux/actions';
import keys from '../../config/keys'

const widgets = [
    {
        route: '/campaigns/browse',
        text: 'Campaign',
        Icon: PhoneIphoneIcon
    },
    // {
    //     route: '/banners/browse',
    //     text: 'QR Banner',
    //     Icon: CropFreeIcon
    // },
]
const responses = [
    {
        route: '/responses/profiles',
        text: 'Profiles',
        Icon: ProfileIcon
    },
    {
        route: '/responses/campaigns',
        text: 'Campaigns',
        Icon: CampaignIcon
    },
]
const settings = [
    {
        route: '/settings/settings',
        text: 'Settings',
        Icon: SettingsIcon
    },
    {
        route: '/settings/contact-us',
        text: 'Contact Us',
        Icon: ContactIcon
    }
]

//Navigation bar on the left panel. Uses custom made router from index file. 
class Navigation extends React.Component {    
    constructor(props) {
        super(props)

        this.state = {            
            isDesktop: true,
            clickedRoute: ''
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }
        
    //mobile vs desktop
    resize() {
        let isDesktop = (window.innerWidth >= 800);
        if (isDesktop !== this.state.isDesktop) {
            this.setState({isDesktop});
        }
    }
    
    //handle click of a menu item through redirect
    handleClick(route) {
        this.setState({clickedRoute: route})
        //show load bar on the top bar with redux
        this.props.startLoading()
        this.props.closeNav()
    }
    
    isSelected(route) {
        //have the menu turn gray when clicked. 
        const {clickedRoute} = this.state
        // Otherwise, make the menu that matches the router selected
        if (clickedRoute != '') return route == clickedRoute        
        return route == this.props.route
    }
    
    renderList(list) {
        const {classes} = this.props
        return (
            <List className={classes.list}>
                {list.map(navItem => {
                    const {route, text, Icon} = navItem
                    return (
                        <a style={{
                            color: keys.APP_COLOR_GRAY_DARK,
                            textDecoration: 'none'
                        }} key={route} href={route} passhref='true'>
                            <ListItem 
                                className={classes.listItem}
                                key={route}
                                button
                                onClick={() => this.handleClick(route)}
                                selected={this.isSelected(route)}
                            >
                                <ListItemIcon className={classes.listItemIcon}><Icon/></ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        </a>
                    )
                })}
            </List>
        )
    }

    renderMenu() {
        const {classes} = this.props
        return (
            <div>
                <Typography className={classes.menuLabel}>Campaigns</Typography>
                {this.renderList(widgets)}  
                <Typography className={classes.menuLabel}>Responses</Typography>
                {this.renderList(responses)}  
                <Typography className={classes.menuLabel}>Settings</Typography>
                {this.renderList(settings)}  
                {/* <a style={{
                    color: keys.APP_COLOR_GRAY_DARK,
                    textDecoration: 'none'
                }} passhref='true'>
                    <ListItem 
                        className={classes.listItem}
                        key='payment-plans'
                        button
                        onClick={() => this.props.showPaymentPlanAction(true, 'Our Plans')}
                        selected={false}
                    >
                        <ListItemIcon className={classes.listItemIcon}><StoreIcon/></ListItemIcon>
                        <ListItemText primary='Plans'/>
                    </ListItem>
                </a> */}
            </div>
        )
    }
    
    renderLogo() {
        const {classes} = this.props
        return (
            <div className={classes.logoWrapper}>
                <img className={classes.logo} src='../static/app/logo-white.svg'/>
            </div>             
        )
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {/* MOBILE */}
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.hide]: this.state.isDesktop
                    })}
                    open={this.props.open}
                    anchor="left"
                    variant="persistent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {this.renderLogo()}
                    {this.renderMenu()}
                </Drawer>
                {/* DESKTOP */}
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.hide]: !this.state.isDesktop
                    })}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {this.renderLogo()}
                    {this.renderMenu()}
                </Drawer>
            </div>
        )
    }
}

const useStyles = theme => ({
    drawer: {
        width: keys.NAV_WIDTH,
        flexShrink: 0
    },
    logo: {
        // width: keys.NAV_WIDTH - 50,
        height: '100%',
        padding: '0px 8px',
        
    },
    logoWrapper: {        
        height: 45,
        marginTop: 5,
        
        display: 'flex',
        alignItems: 'flex-end'
    },
    menuLabel: {
        padding: theme.spacing(1),
        color: keys.APP_COLOR_GRAY,
        borderBottom: '1px solid #273240',
    },
    list: {
        paddingBottom: 0
    },
    listItem: {
        height: 35
    },
    listItemIcon: {
        color: keys.APP_COLOR_GRAY_DARK,
    },
    hide: {
        display: 'none'
    },
    drawerPaper: {
        width: keys.NAV_WIDTH,
        background: keys.NAV_COLOR,
        color: keys.APP_COLOR_GRAY,
        padding: '0px 10px 0px'
        // padding: 10
    },
})

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showPaymentPlanAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Navigation));