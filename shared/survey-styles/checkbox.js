const OPTION_CONTAINER = {
    borderStyle: `solid`,
    display: 'inline-block',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: '100%',
    HOVER: {
        opacity: 0.8,
        transition: '0.2s'
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.2s'
    }
}

const OPTION_CONTAINER_DESKTOP = {
    ...OPTION_CONTAINER
}

const OPTION_WRAPPER = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
}

const OPTION_WRAPPER_DESKTOP = {
    ...OPTION_WRAPPER
}

const RADIO = {
    appearance: 'none',
    cursor: 'pointer',
    outline: 'none',
    position: 'relative',
    height: 20,
    width: 20,
    marginRight: 20,
    BEFORE: {
        display: 'block',
        position: 'absolute',
        content: '""',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        borderWidth: 1.5,
        borderStyle: 'solid',
        transition: '0.2s',
    },
    AFTER: {
        display: 'block',
        position: 'absolute',
        content: '""',
        backgroundColor: 'white',
        height: '60%',
        width: '60%',
        left: '20%',
        top: '20%',
        transition: '0.2s',
    },
    CHECKED_AFTER: {
        
    }
}

const RADIO_DESKTOP = {
    ...RADIO
}

const TEXT = {
    margin: 0,
    fontSize: 18
}

const TEXT_DESKTOP = {
    ...TEXT
}

module.exports = {
    OPTION_CONTAINER,
    OPTION_CONTAINER_DESKTOP,
    OPTION_WRAPPER,
    OPTION_WRAPPER_DESKTOP,
    RADIO,
    RADIO_DESKTOP,
    TEXT,
    TEXT_DESKTOP
}