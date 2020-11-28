const CONTAINER = {
    // margin: '30px 0px',
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0px'
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const BUTTON = {
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 700,
    width: '100%',
    // borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `none`,
    // padding: `0px 0px 8px 0px`,
    // borderColor: 'black',
    fontSize: 20,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        color: 'gray',
        fontSize: 18,
    }
}

const BUTTON_DESKTOP = {
    ...BUTTON
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    BUTTON,
    BUTTON_DESKTOP
}