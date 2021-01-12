const HEADER_CONTAINER = {
    zIndex: 100,
    padding: '30px 30px 20px 30px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    left: 0,
    boxShadow: '0px 0.5px 1px 0px rgba(0,0,0,0.1)'
}

const HEADER_CONTAINER_DESKTOP = {
    ...HEADER_CONTAINER
}

const TITLE = {
    margin: 0,
}

const TITLE_DESKTOP = {
    ...TITLE
}

const LOGO = {
    height: 30
}

const LOGO_DESKTOP = {
    ...LOGO
}

module.exports = {
    HEADER_CONTAINER,
    HEADER_CONTAINER_DESKTOP,
    TITLE,
    TITLE_DESKTOP,
    LOGO,
    LOGO_DESKTOP
}