import React from 'react';
import { SketchPicker } from 'react-color'

import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';

import keys from '../../config/keys'

function ColorPicker(props) {
	const [anchorEl, setAnchorEl, color] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		(props.handleClose) ? props.handleClose(color) : null
	};

	const open = Boolean(anchorEl);

	return (
		<div className={props.classes.container}>
				<div className={props.classes.swatchContainer}>
					<div className={props.classes.swatch } onClick={handleClick}>
		                <div className={props.classes.color} style={{backgroundColor: props.color}} />
		            </div>
		            {props.textDisabled ? 
		            	<p className={props.classes.subtext}>{props.text}</p>
		            : null}
				</div>
            {	
            	props.textDisabled ? null :
            	<TextField            
	            	onChange={event =>{
	            		const color = event.target.value
	            		props.onChange(color)
	            	}}
	                label={props.text}
	                className={props.classes.textField}
	                value={props.color}                    
	            />
            }
			<Popover
				style={{zIndex: 9999999999}}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>				
				<SketchPicker color={props.color} onChange={color => {
					const {r,g,b,a} = color.rgb
					const rgba = `rgba(${r},${g},${b},${a})`
					props.onChange(rgba)} 
				} />
			</Popover>
		</div>
	);
}

const useStyles = theme => ({  
	container: {
		display: 'flex',
		justifyContent: 'row',
		
	},
	swatchContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
    color: {
        width: '40px',
        height: '40px',
        borderRadius: '20px',        
    },
    textField: {
    	marginLeft: 20, flex: 1
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '30px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
    subtext: {
    	color: keys.APP_COLOR_GRAY_DARKER,
    	margin: '5px 0px 0px 0px',
    	fontSize: 10
    }
})

export default withStyles(useStyles)(ColorPicker)