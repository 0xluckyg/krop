const LONG_FORM = {
    border: 'none',
    borderRadius: '0px',
    borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `solid`,
    padding: `0px 0px 8px 0px`,
    color: '#183A4C',
    font: '1rem/2.4rem Georgia, serif',
    width: '100%',
    resize: 'none',
    overflowY: 'hidden',
    height: '32px',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 18,
    transition: '0.2s',
    FOCUS: {
        outline: 'none',
        opacity: 0.7,
        transition: '0.2s'
    },
    PLACEHOLDER: {
        fontSize: 18,
        opacity: 0.7
    }
}

const LONG_FORM_DESKTOP = {
    ...LONG_FORM
}

module.exports = {
    LONG_FORM,
    LONG_FORM_DESKTOP
}