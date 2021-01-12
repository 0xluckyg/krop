const NAME_WRAPPER = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}

const NAME_WRAPPER_DESKTOP = {
    ...NAME_WRAPPER
}

const FRONT_NAME = {
    marginRight: 20
}

const FRONT_NAME_DESKTOP = {
    ...FRONT_NAME
}

const NAME = {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
    borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `solid`,
    padding: `0px 0px 8px 0px`,
    borderColor: 'black',
    fontSize: 18,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        fontSize: 18,
        opacity: 0.7
    }
}

const NAME_DESKTOP = {
    ...NAME
}

module.exports = {
    NAME_WRAPPER,
    NAME_WRAPPER_DESKTOP,
    FRONT_NAME,
    FRONT_NAME_DESKTOP,
    NAME,
    NAME_DESKTOP
}