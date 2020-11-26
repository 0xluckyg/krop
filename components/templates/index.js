import React from 'react';
import axios from 'axios'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import shortid from 'shortid'

import { withStyles } from '@material-ui/core/styles';
import { Modal, Button, TextField, Chip, ListItem } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';

import {
    showToastAction, 
    isLoadingAction, 
    getUserAction,
    getUserResolveAction
} 
from '../../redux/actions';
import keys from '../../config/keys';
import Templates from './template-list'
import staticTemplateOptions from './static-options'
import ColorPicker from '../reusable/color-picker'

const defaultState = {
    name: '',
    isLoading: true,
    selectedSegmentIndex: 0,
    selectedCategoryIndex: 0,
    searchText: '',
    selectedCard: null,
    
    page: 1,
    total: 0,
    totalPages: 0,
    templates: [],
    hasPrevious: false,
    hasNext: false,
}

//A pop up to show subscription plans
class TemplateModal extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            ...defaultState
        }
        this.timeout = 0
    }
    
    handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const {hasNext, page, searchText} = this.state
        if (bottom && hasNext) {
            // this.fetchTemplates({
            //     page: page + 1, search: searchText
            // })
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        const templateOptions = this.props.templateOptions
        if (JSON.stringify(prevProps.templateOptions) != JSON.stringify(templateOptions)) {
            console.log("wtf")
            this.fetchTemplates({
                page: 1
            })
        }
    }
    
    componentDidMount() {
        this.fetchTemplates({
            page: 1
        })
    }
    
    getSegment(segmentIndex) {
        const {templateOptions} = this.props
        let {selectedSegmentIndex} = this.state
        selectedSegmentIndex = (typeof segmentIndex !== 'undefined') ? segmentIndex : selectedSegmentIndex
        const selectedSegmentType = templateOptions[selectedSegmentIndex].templateType
        return staticTemplateOptions[selectedSegmentType]
    }
    
    getCategory(segmentIndex, categoryIndex) {
        let {selectedCategoryIndex} = this.state
        selectedCategoryIndex = (typeof categoryIndex !== 'undefined') ? categoryIndex : selectedCategoryIndex
        const segment = this.getSegment(segmentIndex)
        return segment.options[selectedCategoryIndex]
    }
    
    getOption(segmentIndex) {
        const {templateOptions} = this.props
        let {selectedSegmentIndex} = this.state
        selectedSegmentIndex = (typeof segmentIndex !== 'undefined') ? segmentIndex : selectedSegmentIndex

        return templateOptions[selectedSegmentIndex]
    }
    
    handleFinishSelect() {
        const {selectedCard, templates, name} = this.state
        if (!name || name == '') {
            return this.props.showToastAction(true, "Please give a name")
        }
        
        const option = this.getOption()
        
        let newTemplate = templates[selectedCard]
        option.onSelect(newTemplate, name)
        if (option.preventClose) return
        this.closeTemplateSelector(true)
    }
    
    rgbToHex(rgb){
        if (!rgb || rgb.includes('#')) return rgb
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    
    changeWidgetColors(originalTemplates) {
        let {primaryColor, secondaryColor} = this.props.getUserReducer
        primaryColor = this.rgbToHex(primaryColor)
        secondaryColor = this.rgbToHex(secondaryColor)
        let refactoredTemplates = []
        originalTemplates.map(widget => {
            let templateString = JSON.stringify(widget)
            templateString = templateString.replace(/{{PRIMARY_COLOR}}/g, primaryColor)
            templateString = templateString.replace(/{{SECONDARY_COLOR}}/g, secondaryColor)
            refactoredTemplates.push(JSON.parse(templateString))
            
        })
        return refactoredTemplates
    }
    
    fetchTemplates(options) {
        const {page, search, segmentIndex, categoryIndex} = options
        if (!this.props.templateOptions) return null
        
        let {selectedSegmentIndex, selectedCategoryIndex} = this.state
        selectedSegmentIndex = (typeof segmentIndex !== 'undefined') ? segmentIndex : selectedSegmentIndex
        selectedCategoryIndex = (typeof categoryIndex !== 'undefined') ? categoryIndex : selectedCategoryIndex
        let {templateType, category, query} = this.getCategory(selectedSegmentIndex, selectedCategoryIndex)
        let params = { 
            templateType,
            category,
            page
        }
        
        if (search) params.search = search
        if (page <= 1) {
            this.setState({isLoading: true})
        }
        query = process.env.APP_URL + query
        axios.get(query, {
            params,
            withCredentials: true
        }).then(res => {
            let result = res.data
            result.templates = this.changeWidgetColors(result.templates)
            if (page > 1) {
                result.templates = [...this.state.templates, ...result.templates]
                this.setState({...result})
            } else {
                this.setState({...result, ...{ isLoading: false }})
            }
        }).catch(err => {
            this.setState({isLoading: false})
            this.props.showToastAction(true, "Couldn't get templates. Please try again later.")
            return err
        })
    }
    
    isCategorySelected(segmentIndex, categoryIndex) {
        const {selectedSegmentIndex, selectedCategoryIndex} = this.state
        return (categoryIndex == selectedCategoryIndex && segmentIndex == selectedSegmentIndex)
    }
    
    handleTagSelect(tag) {
        this.setState({searchText: tag})
        this.fetchTemplates({
            page: 1, search: tag
        })
    }
    
    handleCategorySelect(segmentIndex, categoryIndex) {
        this.setState({
            selectedSegmentIndex: segmentIndex, 
            selectedCategoryIndex: categoryIndex, 
            templates: [], 
            selectedCard: null
        })
        this.fetchTemplates({
            page: 1, 
            segmentIndex, 
            categoryIndex
        })
    }
    
    handleSearch(searchText) {
        this.setState({searchText})
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.fetchTemplates({
                page: 1, search: searchText
            })
        }, 800);
    }
    
    changePrimaryColor(primaryColor) {
        let user = this.props.getUserReducer
        this.props.getUserResolveAction({...user, primaryColor})
    }
    
    changeSecondaryColor(secondaryColor) {
        let user = this.props.getUserReducer
        this.props.getUserResolveAction({...user, secondaryColor})
    }
    
    closeTemplateSelector(forceClose) {
        let skipDisallowed = false
        this.props.templateOptions.map(option => {
            if (option.skipDisallowed) {
                skipDisallowed = true
            }
        })
        if (skipDisallowed && !forceClose) return
        this.props.setState({templateOptions: null})
        this.setState(defaultState)
    }
    
    renderHeader() {
        const { classes, type } = this.props;
        return (
                <p className={classes.templateHeader}>Choose a template from our gallery!</p>
        )
    }
    
    renderNavBar() {
        const {classes} = this.props
        const options = this.props.templateOptions
        return (
            <div className={classes.navBar}>
                {options.map((option, segmentIndex) => {
                    const disabled = option.disabledCategories
                    const segmentType = option.templateType
                    const segment = staticTemplateOptions[segmentType]
                    return (
                        <div key={shortid.generate()}>
                            <p className={classes.navBarSegmentHeader}>{segment.name}</p>
                            {segment.options.map((navItem, categoryIndex) => {
                                const {category, text} = navItem
                                if (disabled && disabled.includes(category)) return null
                                return (
                                    <ListItem 
                                        className={classes.navListItem}
                                        key={shortid.generate()}
                                        button
                                        onClick={() => this.handleCategorySelect(segmentIndex, categoryIndex)}
                                        selected={this.isCategorySelected(segmentIndex, categoryIndex)}
                                    >
                                        <p className={classes.navListText}>{text}</p>
                                    </ListItem>
                                )
                            })}   
                        </div>
                    )
                })}   
            </div>
        )
    }
    
    renderColorPicker() {
        const {classes} = this.props
        const {searchText} = this.state
        const {primaryColor, secondaryColor} = this.props.getUserReducer
        return (
            <div className={classes.colorPickerContainer}>
                <ColorPicker
                    textDisabled
                    text="Primary"
                    color={primaryColor}
                    onChange={primaryColor => this.changePrimaryColor(primaryColor)}
                    handleClose={() => {
                        this.fetchTemplates({
                            page: 1, search: searchText
                        })
                    }}
                />
                <div style={{width: 15}}></div>
                <ColorPicker
                    textDisabled
                    text="Secondary"
                    color={secondaryColor}
                    onChange={secondaryColor => this.changeSecondaryColor(secondaryColor)}
                    handleClose={() => {
                        this.fetchTemplates({
                            page: 1, search: searchText
                        })
                    }}
                />
            </div>
        )
    }
    
    renderTagChips() {
        const {classes} = this.props
        
        const segment = this.getSegment()
        const category = this.getCategory()
        
        const tags = category.tags ? category.tags : (segment.tags ? segment.tags : [])
        return (
            <div className={classes.chipsContainer}>
                {(tags) ? tags.map((tag, i) => {
                    return (
                        <Chip
                            key={tag}
                            label={tag}
                            className={classes.chip}
                            onClick={() => this.handleTagSelect(tag)}
                        />
                    );
                }) : null}
            </div>    
        )
    }

    renderSearch() {
        const {classes} = this.props
        const {searchText} = this.state
        return (
            <div className={classes.searchContainer}>
                <SearchIcon className={classes.searchIcon}/>
                <input 
                    ref="searchInput"
                    className={classes.searchBar} 
                    value={searchText} 
                    onChange={event => this.handleSearch(event.target.value)}
                    placeholder="Search" 
                    type={keys.TEXT_PROPERTY}
                />
            </div>
        )
    }

    renderFooter() {
        const {classes, type} = this.props
        const {name, selectedCard} = this.state
        if (selectedCard == null) return null
        return (
            <div className={classes.footer}>
                <TextField
                    className={classes.footerTextField}
                    id="name"
                    label="Choose a name"
                    value={name}
                    onChange={(event) => {
                        this.setState({name:event.target.value})
                    }}
                    margin="normal"
                    placeholder="Please enter a name"
                    fullWidth
                />
                <Button 
                    onClick={() => this.handleFinishSelect()} 
                    color="secondary"
                    variant="outlined"
                    className={classes.footerButton}
                >
                        {type == keys.WIDGET ? 'GET STARTED' : 'SELECT'}
                </Button>
            </div>
        )
    }

    render() {
        const { templateOptions, classes } = this.props;
        if (templateOptions == null) return null
        const category = this.getCategory()
        return(
            <Modal 
                open={templateOptions ? true : false} 
                onClose={() => this.closeTemplateSelector()}
            >
                <div className={classes.modalContainer}>
                    {this.renderHeader()}
                    <div className={classes.mainContainer}>
                        {this.renderNavBar()}
                        <div className={classes.templateContainer}>
                            <div className={classes.topBar}>
                                {this.renderColorPicker()}
                                <div className={classes.tagBar}>
                                    {this.renderTagChips()}
                                </div>
                            </div>
                            {this.renderSearch()}
                            <div className={classes.templates}>
                                <Templates 
                                    category={category}
                                    handleScroll={e => this.handleScroll(e)}
                                    state={this.state}
                                    setState={(state) => this.setState(state)}
                                />
                            </div>
                        </div>
                    </div>
                    {this.renderFooter()}
                </div>
            </Modal>
        )
    }
}


const templateHeight = '70vh'
const tagBarHeight = '90px'
const navWidth = '200px'
const footerHeight = '90px'
const useStyles = theme => ({
    modalContainer: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        backgroundColor: 'transparent',
        boxShadow: theme.shadows[5],
        outline: 'none',
        overflowX: 'auto',
        width: '80%',
        display: 'block',
        [theme.breakpoints.up('md')]: {
            height: 'auto',
		},
		
		borderRadius: 10
    },
    templateHeader: {
        fontSize: 18,
        fontWeight: 200,
        textAlign: 'left',
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        margin: 0,
        color: 'black',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    navBar: {
        overflowY: 'auto',
        width: navWidth,
        height: `calc(${templateHeight} + ${tagBarHeight} + 40px)`,
        backgroundColor: keys.NAV_COLOR,
        paddingBottom: 15
    },
    navBarSegmentHeader: {
        color: keys.APP_COLOR_GRAY_DARK,
        fontWeight: 500,
        paddingLeft: 20  
    },
    navList: {
        paddingBottom: 0
    },
    navListItem: {
        height: 35,
        color: keys.APP_COLOR_GRAY_DARK,
        fontWeight: 100,
        paddingLeft: 40
    },
    navListText: {
        fontWeight: 100
    },
    templateContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        height: tagBarHeight
    },
    tagBar: {
        width: '100%',
        height: tagBarHeight,
        overflowY: 'auto',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT
    },
    colorPickerContainer: {
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    chipsContainer: {
        flex: 1,
        padding: 10
    },
    chip: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        cursor: 'pointer'
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        paddingLeft: 20
    },
    searchIcon: {
        color: keys.APP_COLOR_GRAY_DARK  
    },
    searchBar: {
        width: '100%',
        height: 40,
        backgroundColor: keys.APP_COLOR_GRAY_LIGHT,
        border: 0,
        paddingLeft: 10,
        fontSize: 18,
        fontFamily: 'Roboto',
        fontWeight: 100,
        '&:focus': {
            outline: 'none'
        }
    },
    templates: {
        width: '100%',
        height: templateHeight,
        backgroundColor: 'white',
        overflowY: 'auto',
        position: 'relative'
    },
    footer: {
        position: 'absolute',
        width: '100%',
        height: footerHeight,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0px 40px 20px 40px',
        boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.57)',
        backgroundColor: 'white'
    },
    footerTextField: {
        width: 300,
        marginBottom: 0
    },
    footerButton: {
        height: 40,
        
    }
});

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction, getUserAction, getUserResolveAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(TemplateModal));