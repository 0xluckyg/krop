const CONTAINER = {
    margin: '30px 0px'
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const QUESTION = {
    fontSize: 20,
    margin: '0px 0px 10px 0px'
}

const QUESTION_DESKTOP = {
    ...QUESTION
}

const OPTION_CONTAINER = {
    borderStyle: `solid`,
    display: 'inline-block',
    borderRadius: 20,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    width: '100%',
    HOVER: {
        opacity: 0.8,
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
    height: 25,
    width: 25,
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
        borderRadius: 15
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
        borderRadius: 15
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
    CONTAINER,
    CONTAINER_DESKTOP,
    QUESTION,
    QUESTION_DESKTOP,
    OPTION_CONTAINER,
    OPTION_CONTAINER_DESKTOP,
    OPTION_WRAPPER,
    OPTION_WRAPPER_DESKTOP,
    RADIO,
    RADIO_DESKTOP,
    TEXT,
    TEXT_DESKTOP
}