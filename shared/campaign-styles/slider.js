const SLIDER = {
    cursor: 'pointer',
    appearance: 'none',
    padding: 0,
    padding: 0 + 'px',
    'box-sizing': 'content-box',
    border: 0,
    width: '100%',
    marginTop: '5px',
    TRACK: {
        height: '0.5px',
        width: '100%',
        borderRadius: '15px',
        appearance: 'none',
        height: '0.5px',
        width: '100%'
    },
    ACTIVE: {
    },
    THUMB: {
        appearance: 'none',
        width: '20px',
        height: '20px',
        borderRadius: '10px',
        boxShadow: '0px',
        borderWidth: '0px',
        marginTop: `${(0.5 - 20) / 2}px`,
        marginBottom: `${(0.5 - 20) / 2}px`,
        borderStyle: `solid`
    }
}

const SLIDER_DESKTOP = {
    ...SLIDER
}

module.exports = {
    SLIDER,
    SLIDER_DESKTOP
}