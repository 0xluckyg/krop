const SHARE_CONTAINER = {
    // display: 'flex',
    // alignItems: 'center',
    margin: '15px 0px',
    transition: '0.1s',
    height: 'auto'
}

const SHARE_CONTAINER_DESKTOP = {
    ...SHARE_CONTAINER
}

const SHARE_TITLE = {
    marginBottom: '-5px'
}

const SHARE_TITLE_DESKTOP = {
    ...SHARE_TITLE
}

const SHARE_BUTTON = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 100,
    width: '100%',
    border: `none`,
    padding: '13px 25px',
    borderRadius: '30px',
    fontSize: '14px',
    transition: '0.1s',
    marginTop: '15px',
    outline: 'none',
    FOCUS: {
        border: 'none',
        transition: '0.1s'
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.1s'
    },
    HOVER: {
        opacity: 0.8,
        transition: '0.1s'
    }
} 

const SHARE_BUTTON_DESKTOP = {
    ...SHARE_BUTTON
}

const SHARE_BUTTON_ICON = {
    margin: '0px',
    fill: 'white',
    width: '20px',
    height: '20px',
    display: 'inherit',
    marginRight: '10px'
}

const SHARE_BUTTON_ICON_DESKTOP = {
    ...SHARE_BUTTON_ICON
}

const SHARE_BUTTON_TEXT = {
    display: 'inline-block',
    margin: '0px',
    color: 'white'
}

const SHARE_BUTTON_TEXT_DESKTOP = {
    ...SHARE_BUTTON_TEXT
}

module.exports = {
    SHARE_CONTAINER,
    SHARE_TITLE,
    SHARE_TITLE_DESKTOP,
    SHARE_CONTAINER_DESKTOP,
    SHARE_BUTTON,
    SHARE_BUTTON_DESKTOP,
    SHARE_BUTTON_ICON,
    SHARE_BUTTON_ICON_DESKTOP,
    SHARE_BUTTON_TEXT,
    SHARE_BUTTON_TEXT_DESKTOP
}