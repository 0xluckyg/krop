const BODY = {
    margin: '0px',
    padding: '20px',
    fontFamily: 'helvetica',
    backgroundColor: 'black'
}

const BODY_DESKTOP = {
    ...BODY
}

const CONTAINER = {
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto'
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const WRAPPER = {
    padding: '10px 20px 20px 20px',
    borderTop: 'solid 3px #FFB34A'
}

const WRAPPER_DESKTOP = {
    ...WRAPPER
}

const DIVIDER = {
    width: '100%',
    height: '30px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const DIVIDER_DESKTOP = {
    ...DIVIDER
}

const LINE = {
    flex: 1,
    borderBottom: 'dashed 1px gray'
}

const LINE_DESKTOP = {
    ...LINE
}

const CIRCLE = {
    position: 'absolute',
    backgroundColor: 'black',
    width: '20px',
    height: '20px',
    borderRadius: '10px'
}

const CIRCLE_DESKTOP = {
    ...CIRCLE
}

const CIRCLE_LEFT = {
    left: '10px'
}

const CIRCLE_LEFT_DESKTOP = {
    ...CIRCLE_LEFT
}

const CIRCLE_RIGHT = {
    right: '10px'
}

const CIRCLE_RIGHT_DESKTOP = {
    ...CIRCLE_RIGHT
}

const IMAGE = {
    width: '100%',
    borderRadius: '5px 5px 0px 0px'
}

const IMAGE_DESKTOP = {
    ...IMAGE
}

const TITLE = {
    margin: '10px 0px',
    fontSize: '30px',
    fontWeight: 700
}

const TITLE_DESKTOP = {
    ...TITLE
}

const DESCRIPTION = {
    margin: '10px 0px',
    fontSize: '15px'
}

const DESCRIPTION_DESKTOP = {
    ...DESCRIPTION
}

const ADDRESS = {
    margin: '10px 0px',
    fontSize: '15px'
}

const ADDRESS_DESKTOP = {
    ...ADDRESS
}

const EXPIRATION = {
    margin: '10px 0px',
    fontSize: '15px'
}

const EXPIRATION_DESKTOP = {
    ...EXPIRATION
}

module.exports = {
    BODY,
    BODY_DESKTOP,
    CONTAINER,
    CONTAINER_DESKTOP,
    WRAPPER,
    WRAPPER_DESKTOP,
    DIVIDER,
    DIVIDER_DESKTOP,
    LINE,
    LINE_DESKTOP,
    CIRCLE,
    CIRCLE_DESKTOP,
    CIRCLE_LEFT,
    CIRCLE_LEFT_DESKTOP,
    CIRCLE_RIGHT,
    CIRCLE_RIGHT_DESKTOP,
    IMAGE,
    IMAGE_DESKTOP,
    TITLE,
    TITLE_DESKTOP,
    DESCRIPTION,
    DESCRIPTION_DESKTOP,
    ADDRESS,
    ADDRESS_DESKTOP,
    EXPIRATION,
    EXPIRATION_DESKTOP
}