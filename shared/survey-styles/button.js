const BUTTON_CONTAINER = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0px',
    transition: '0.1s',
    height: '40px',
    HOVER: {
        opacity: 0.8,
        transition: '0.1s'
    }
}

const BUTTON_CONTAINER_DESKTOP = {
    ...BUTTON_CONTAINER
}

const BUTTON = {
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 700,
    // width: '100%',
    borderStyle: `none`,
    outline: 'none',
    fontSize: 20,
    transition: '0.1s',
    FOCUS: {
        border: 0,
        transition: '0.1s'
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.1s'
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