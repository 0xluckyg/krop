const BUTTON_CONTAINER = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0px'
}

const BUTTON_CONTAINER_DESKTOP = {
    ...BUTTON_CONTAINER
}

const BUTTON = {
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 700,
    width: '100%',
    borderStyle: `none`,
    fontSize: 20,
    FOCUS: {
        outline: 'none'  
    },
    HOVER: {
        opacity: 0.8
    },
    ACTIVE: {
        opacity: 0.6
    }
}

const BUTTON_DESKTOP = {
    ...BUTTON
}

module.exports = {
    BUTTON_CONTAINER,
    BUTTON_CONTAINER_DESKTOP,
    BUTTON,
    BUTTON_DESKTOP
}