const VIDEO_CONTAINER = {
    position: 'relative',
    paddingBottom: '56.25%',
    // height: 0,
}

const VIDEO_CONTAINER_DESKTOP = {
    ...VIDEO_CONTAINER
}

const VIDEO = {
    border: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderWidth: 0,
    boxShadow: 0
}

const VIDEO_DESKTOP = {
    ...VIDEO
}

module.exports = {
    VIDEO_CONTAINER,
    VIDEO_CONTAINER_DESKTOP,
    VIDEO,
    VIDEO_DESKTOP
}