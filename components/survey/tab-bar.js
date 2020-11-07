import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

const TopTabs = withStyles({
    indicator: {
        top: 0
    },
})(Tabs);

export default function SimpleTabs(props) {
    if (props.indicator == 'top') {
        return (
            <TopTabs
                value={props.value} onChange={props.handleChange} aria-label="tab-bar">
                <Tab label="Design" id='0'/>
                <Tab label="Settings" id='1' />
            </TopTabs>
        );
    } else {
        return (
            <Tabs
                value={props.value} onChange={props.handleChange} aria-label="tab-bar">
                <Tab label="Design" id='0' />
                <Tab label="Settings" id='1' />
            </Tabs>
        );   
    }
}