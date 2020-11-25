import React from 'react'

import Popover from '@material-ui/core/Popover';

function PopoverWrapper(props) {

	const {customOpen, customClose, style, customSelector, children, font,
		anchorVertical, anchorHorizontal, transformVertical, transformHorizontal, 
		validate, success, error} = props

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		if (customClose) customClose()
		setAnchorEl(null);
	};

	const open = customOpen != undefined ? customOpen : Boolean(anchorEl);

	return (
		<div>
			{customSelector ? customSelector(e => handleClick(e)) :
				<button 
					className={style.button}
					onMouseDown={e => handleClick(e)}
				>
					<i style={{fontSize: 15}} className={font}></i>
				</button>
			}
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={() => {
					if (validate && !validate()) {
						error()
					} else {
						if (success) {
							success()
						}
						handleClose()
					}
				}}
				anchorOrigin={{
					vertical: anchorVertical ? anchorVertical : 'bottom',
					horizontal: anchorHorizontal ? anchorHorizontal : 'left',
				}}
				transformOrigin={{
					vertical: transformVertical ? transformVertical : 'top',
					horizontal: transformHorizontal ? transformHorizontal : 'left',
				}}
			>				
				{children}								
			</Popover>
		</div>
	);
}

export default PopoverWrapper;