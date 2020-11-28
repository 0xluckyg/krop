const CONTAINER = {
    margin: '30px 0px'
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const ADDRESS_WRAPPER = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}

const ADDRESS_WRAPPER_DESKTOP = {
    ...ADDRESS_WRAPPER,
}

const FRONT_ADDRESS = {
    marginRight: 20
}

const FRONT_ADDRESS_DESKTOP = {
    ...FRONT_ADDRESS
}

const ADDRESS = {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
    borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `solid`,
    padding: `0px 0px 8px 0px`,
    borderColor: 'black',
    fontSize: 18,
    marginBottom: 15,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        color: 'gray',
        fontSize: 18,
    }
}

const ADDRESS_DESKTOP = {
    ...ADDRESS
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    FRONT_ADDRESS,
    FRONT_ADDRESS_DESKTOP,
    ADDRESS_WRAPPER,
    ADDRESS_WRAPPER_DESKTOP,
    ADDRESS,
    ADDRESS_DESKTOP
}