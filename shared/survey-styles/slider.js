const SLIDER = {
    TRACK: {
        height: 0.5,
        width: '100%',
        borderRadius: 15,
    },
    ACTIVE: {
    },
    THUMB: {
        width: 20,
        height: 20,
        borderStyle: `solid`,
        borderRadius: 10,
        boxShadow: 0,
        borderWidth: 0
    }
}

const SLIDER_DESKTOP = {
    ...SLIDER
}

module.exports = {
    SLIDER,
    SLIDER_DESKTOP
}