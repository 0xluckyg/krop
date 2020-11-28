const CONTAINER = {
    // margin: '30px 0px',
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0px',
    position: 'sticky',
    top: 0,
    left: 0
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const HEADER = {
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

const HEADER_DESKTOP = {
    ...HEADER
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    HEADER,
    HEADER_DESKTOP
}