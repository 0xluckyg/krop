const FORM = {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
    borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `solid`,
    padding: `0px 0px 8px 0px`,
    fontSize: 18,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        fontSize: 18,
        opacity: 0.7
    }
}

const FORM_DESKTOP = {
    ...FORM
}

module.exports = {
    FORM,
    FORM_DESKTOP
}