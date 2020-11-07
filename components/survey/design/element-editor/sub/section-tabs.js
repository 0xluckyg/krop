import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import keys from '../../../../../config/keys'

const CustomTabs = withStyles({
    root: {
        fontSize: 13,
        minHeight: 41
    }
})(Tabs)

const CustomTab = withStyles({
    root: {
        minWidth: props => keys.SIDE_EDITOR_WIDTH / props.count,
        fontSize: 12,
        fontWeight: 400,
        minHeight: 41,
        color: keys.APP_COLOR_GRAY_DARKEST,
    }
})(Tab)

function SectionTabs(props) {
    return (
        <CustomTabs
            style={{height: '20px'}}
            value={props.value} onChange={(event, newValue) => props.handleChange(newValue)} aria-label="tab-bar">
            {props.tabs.map(tab => {
                const {value, name} = tab
                return <CustomTab value={value} key={value} label={name} id={value} count={props.tabs.length}/>
            })}
        </CustomTabs>
    );   
}

export default SectionTabs