const ADDRESS_WRAPPER = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}

const ADDRESS_WRAPPER_DESKTOP = {
    ...ADDRESS_WRAPPER,
}

const ADDRESS_TITLE = {
    marginBottom: -5
}

const ADDRESS_TITLE_DESKTOP = {
    ...ADDRESS_TITLE
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
    marginTop: 15,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        fontSize: 18,
        opacity: 0.7
    }
}

const ADDRESS_DESKTOP = {
    ...ADDRESS
}

module.exports = {
    ADDRESS_WRAPPER,
    ADDRESS_WRAPPER_DESKTOP,
    ADDRESS_TITLE,
    ADDRESS_TITLE_DESKTOP,
    FRONT_ADDRESS,
    FRONT_ADDRESS_DESKTOP,
    ADDRESS,
    ADDRESS_DESKTOP
}