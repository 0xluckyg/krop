const OPTION_CONTAINER = {
    borderStyle: `solid`,
    display: 'inline-block',
    borderRadius: '20px',
    borderWidth: '0px',
    padding: '0px',
    margin: '0px',
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
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '5px'
}

const OPTION_WRAPPER_DESKTOP = {
    ...OPTION_WRAPPER
}

const RADIO = {
    visibility: 'hidden',
    appearance: 'none !important',
    userSelect: 'none',
    borderWidth: '0px',
    boxShadow: 'none',
    
    cursor: 'pointer',
    outline: 'none',
    position: 'relative',
    height: '25px',
    width: '25px',
    margin: '0px 20px 0px 0px',
    BEFORE: {
        visibility: 'visible',
        display: 'block',
        position: 'absolute',
        content: '""',
        height: '100%',
        width: '100%',
        left: '0%',
        top: '0%',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        transition: '0.2s',
        borderRadius: '15px'
    },
    AFTER: {
        visibility: 'visible',
        backgroundColor: 'transparent',
        display: 'block',
        position: 'absolute',
        content: '""',
        backgroundColor: 'white',
        height: '60%',
        width: '60%',
        left: '20%',
        top: '20%',
        transition: '0.2s',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderRadius: '15px'
    },
    FOCUS: {
        visibility: 'hidden',
        appearance: 'none',
        outline: 'none',
        borderWidth: '0px',
        boxShadow: 'none'
    },
    CHECKED_AFTER: {
        
    }
}

const RADIO_DESKTOP = {
    ...RADIO
}

module.exports = {
    OPTION_CONTAINER,
    OPTION_CONTAINER_DESKTOP,
    OPTION_WRAPPER,
    OPTION_WRAPPER_DESKTOP,
    RADIO,
    RADIO_DESKTOP
}