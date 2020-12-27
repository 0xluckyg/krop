import 'emoji-mart/css/emoji-mart.css'
import React from 'react'
import { SketchPicker } from 'react-color'
// import { Picker } from 'emoji-mart'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
const validUrl = require('valid-url')

import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { showToastAction, showPaymentPlanAction } from '../../../../../redux/actions';
import keys from '../../../../../config/keys'
import {insertGoogleFont} from '../../../../reusable/font-families'
import FontPicker from './font-picker'
import {handleLimit, getProperty, modifyProperty} from './functions'
import PopoverWrapper from '../../../../reusable/popover'

function handlePositionChange(cmd) {
	
	let justifyContent; let textAlign;
	switch(cmd) {
		case('justifyLeft'):
			justifyContent = 'flex-start'; textAlign = 'left'
			break;
		case('justifyCenter'):
			justifyContent = 'center'; textAlign = 'center'
			break;
		case('justifyRight'):
			justifyContent = 'flex-end'; textAlign = 'right'
			break;
		default:
			return;
	}
	wysiwygEditor.document.getElementsByTagName('html')[0].style.justifyContent = justifyContent;
	let nodes = wysiwygEditor.document.getElementsByTagName('body')[0].children
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].style.textAlign = textAlign
	}
}

function EditButton(props) {
	return (
		<div className={props.style.buttonWrapper}>
			<button		
				className={props.style.button}	
				key={props.cmd}
				onMouseDown={() => {	
					handlePositionChange(props.cmd)
					wysiwygEditor.document.execCommand(props.cmd, false, props.arg);
					
					props.callback()
				}}
			>
				<i style={{fontSize: 15}} className={props.font}></i>
			</button>
		</div>
	);
}

class Editor extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = { 
			buttonEditorOpen: false, 
			shareEditorOpen: false,
			
			linkHolder: '',
			textSizeField: 12,
			fontWeightField: 300
		}
	}
	
	getProperty(propertyType, property) {
        const {stage, element, sectionElement} = this.props
        return getProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, property, 
            selectedSectionElement: sectionElement
        })
    }
    
    modifyProperty(propertyType, property, value) {
        const {stage, element, sectionElement} = this.props
        return modifyProperty({
            props: this.props, 
            selectedStage: stage, 
            selectedElement: element, 
            propertyType, 
            property, 
            value, 
            selectedSectionElement: sectionElement
        })
    }
	
	componentDidMount() {		
		wysiwygEditor.document.designMode = 'on'
		this.defaultEditorSetup()
		if(document.addEventListener)
		{
		    wysiwygEditor.document.addEventListener('keyup', () => {
		    	this.updateWysiwygHtml()
		    }, false);
		}
	}
	
	updateWysiwygHtml() {
		let htmlWrapper = wysiwygEditor.document.getElementsByTagName('html')[0]
		let wrapper = document.createElement('div')
		wrapper.style = htmlWrapper.style
		wrapper.style.width = '100%'
		let html = wysiwygEditor.document.getElementsByTagName('body')[0].innerHTML
		wrapper.innerHTML = html
    	return this.modifyProperty(null, keys.HTML_PROPERTY, wrapper.outerHTML)
	}
    
    fontSetup() {
    	this.props.state.fonts.map(font => {
    		insertGoogleFont(wysiwygEditor.document, font)
    	})
    }
    
    defaultEditorSetup() {
    	this.fontSetup()
    	const html = this.getProperty(null, keys.HTML_PROPERTY)
		wysiwygEditor.document.getElementsByTagName('body')[0].innerHTML = html
    }

	changeTextColor(color) {
		wysiwygEditor.document.execCommand("foreColor", false, color.hex)
		this.updateWysiwygHtml()
	}
	
	changeTextHighlight(color) {
		wysiwygEditor.document.execCommand("backColor", false, color.hex)
		this.updateWysiwygHtml()
	}
	
	validateTextLink() {
		const link = this.state.linkHolder
		if (link == '') return true
		return validUrl.isWebUri(this.state.linkHolder)
	}
	
	changeTextLink(color) {
		wysiwygEditor.document.execCommand("createLink", false, this.state.linkHolder)
		this.updateWysiwygHtml()
	}
	
	changeTextLinkState(event) {
		const link = event.target.value
		this.setState({linkHolder: link})
	}
	
	changeFontSize(value) {
	    wysiwygEditor.document.execCommand("fontSize", false, "1");
	    var fontElements = wysiwygEditor.document.getElementsByTagName("font");
	    for (var i = 0, len = fontElements.length; i < len; ++i) {
	        if (fontElements[i].size == "1") {
	            fontElements[i].removeAttribute("size");
	            fontElements[i].style.fontSize = value+'px';
	        }
	    }
	    this.setState({textSizeField: value})
		this.updateWysiwygHtml()
	}
	
	changeFontWeight(value) {
	    wysiwygEditor.document.execCommand("fontSize", false, "1");
	    var fontElements = wysiwygEditor.document.getElementsByTagName("font");
	    for (var i = 0, len = fontElements.length; i < len; ++i) {
	        if (fontElements[i].size == "1") {
	        	fontElements[i].removeAttribute("size");
	            fontElements[i].style.fontWeight = value
	        }
	    }
	    this.setState({fontWeightField: value})
		this.updateWysiwygHtml()
	}
	
	changeTextFont(selected) {
		const familyName = typeof selected === 'string' ? selected : selected.family;
		insertGoogleFont(wysiwygEditor.document, familyName)  
		
		wysiwygEditor.document.execCommand("fontName", false, familyName)
		
		const newState = this.updateWysiwygHtml()
		const num = newState.fonts.findIndex(font => { return font == selected.family } ); 
		if (num < 0) newState.fonts = [...newState.fonts, selected.family]	
		this.props.setState(newState)
	}
	
	insertEmoji(emoji) {
		wysiwygEditor.document.execCommand("insertText", false, emoji.native)
		this.updateWysiwygHtml()
	}
	
	getIframeStyle() {
		const backgroundColor = this.getProperty('style', 'color')
		return {
			width: "100%", 
			display: 'flex',
			alignItems: 'center',
			border: 0, 
			borderRadius: 10, 
			padding: 10,
			height: 100,
			backgroundColor
		}
	}

	render() {
		const {classes} = this.props
		
		const pts = [
			{ value: 10, name: '10pt' },
			{ value: 12, name: '12pt' },
			{ value: 14, name: '14pt' },
			{ value: 18, name: '18pt' },
			{ value: 24, name: '24pt' },
			{ value: 30, name: '30pt' },
			{ value: 36, name: '36pt' },
			{ value: 48, name: '48pt' },
			{ value: 60, name: '60pt' },
			{ value: 72, name: '72pt' },
			{ value: 84, name: '84pt' },
		]
		
		const weights = [
			{ value: 100, name: 'Super light' },
			{ value: 200, name: 'Light' },
			{ value: 300, name: 'Medium light' },
			{ value: 400, name: 'Medium' },
			{ value: 500, name: 'Medium bold' },
			{ value: 600, name: 'Bold' },
			{ value: 700, name: 'Super bold' }
		]

		return (
			<div className={classes.container}>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="italic" font="fa fa-italic" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="bold" font="fa fa-bold" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="underline" font="fa fa-underline" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="strikeThrough" font="fa fa-strikethrough" style={classes}/>
	
				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Text color" font="fa fa-tint" style={classes}>
						<SketchPicker color={'#fff'} onChange={this.changeTextColor.bind(this)} />
					</PopoverWrapper>
				</div>

				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Background color" font="fa fa-fill-drip" style={classes}>
						<SketchPicker color={'#fff'} onChange={this.changeTextHighlight.bind(this)} />
					</PopoverWrapper>		
				</div>
				
				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Link" font="fa fa-link" style={classes}
						validate={this.validateTextLink.bind(this)}
						error={() => this.props.showToastAction(true, 'Please enter a valid button link', 'error')}
						success={this.changeTextLink.bind(this)}
					>
						<TextField                        
							label="Link"
							style={styles.link}
							placeholder='ex. https://vivelop.com'
							onChange={this.changeTextLinkState.bind(this)}
						/>
					</PopoverWrapper>
				</div>
	
				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Size" font="fa fa-text-height" style={classes}>
						<ListItem>
							<TextField
								value={this.state.textSizeField}
								style={styles.sizeTextField}
								placeholder="Size (Pt)"
								onChange={(event) => {
									const value = event.target.value || '';
									if (!handleLimit(value, 0, 1000)) return
									this.changeFontSize(value)
								}}
							/>
						</ListItem>
						<List style={styles.list} component="nav" aria-label="font-size">									
							{pts.map(pt => {
								return <ListItem key={pt.name} style={styles.listItem} button
								onClick={() => this.changeFontSize(pt.value)}
							>						
								<ListItemText style={styles.listItemText} primary={pt.name}/>
							</ListItem>	
							})}
						</List>
					</PopoverWrapper>
				</div>
				
				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Weight" font="fa fa-feather-alt" style={classes}>
						<ListItem>
							<TextField
								value={this.state.fontWeightField}
								style={styles.sizeTextField}
								placeholder="Weight (Pt)"
								onChange={(event) => {
									const value = event.target.value || '';
									if (!handleLimit(value, 100, 700)) return
									this.changeFontWeight(value)
								}}
							/>
						</ListItem>
						<List style={styles.list} component="nav" aria-label="font-size">									
							{weights.map(weight => {
								return <ListItem key={weight.name} style={styles.listItem} button
								onClick={() => this.changeFontWeight(weight.value)}
							>						
								<ListItemText style={styles.listItemText} primary={weight.name}/>
							</ListItem>	
							})}
						</List>
					</PopoverWrapper>
				</div>

				<div className={classes.buttonWrapper}>
					<PopoverWrapper name="Style" font="fa fa-font" style={classes}>
						<FontPicker
							onFontSelected={this.changeTextFont.bind(this)}
							searchable={true}
						/>
					</PopoverWrapper>
				</div>

				{/* <PopoverWrapper name="Emoji" font="far fa-smile-wink" style={classes}> */}
					{/* <Picker set='emojione' onSelect={this.insertEmoji.bind(this)}/> */}
				{/* </PopoverWrapper> */}
				
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="justifyLeft" font="fa fa-align-left" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="justifyCenter" font="fa fa-align-center" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="justifyRight" font="fa fa-align-right" style={classes}/>				
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="undo" font="fa fa-undo" style={classes}/>
				<EditButton callback={this.updateWysiwygHtml.bind(this)} cmd="redo" font="fa fa-redo" style={classes}/>
				<br/>
				<iframe name="wysiwygEditor" style={this.getIframeStyle()}></iframe>				
			</div>
		)
	}
}

const useStyles = theme => ({
	container: {
		marginLeft: -10,	
		marginRight: -10
	},
	button: {
		border: 0,	
		backgroundColor: 'white',
		outline: 0,
		cursor: 'pointer',
        '&:active': {
            color: keys.APP_COLOR_LIGHT
        },
        '&:hover': {
            color: keys.APP_COLOR_GRAY_DARK
        }
	},
	buttonWrapper: {
		float: 'left',
		display: 'inline-block',
		padding: 10
	},
	icon: {
		fontSize: 15,
	},
})

const styles = {
	sizeTextField: {
		padding: 0,
		marginTop: 10 
	},
	link: {
		margin: 15
	},
	list: {
		height: 200,
		padding: 0
	},
	listItem: {
		height: 30
	},
	listItemText: {
		fontSize: 20
	}
}

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, showPaymentPlanAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Editor));