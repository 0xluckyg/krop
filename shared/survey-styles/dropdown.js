const CONTAINER = {
    margin: '30px 0px'
}

const CONTAINER_DESKTOP = {
    ...CONTAINER
}

const QUESTION = {
    fontSize: 20,
    margin: '0px 0px 10px 0px'
}

const QUESTION_DESKTOP = {
    ...QUESTION
}

const DROPDOWN_WRAPPER = {
    position: 'relative',
    display: 'flex',
    lineHeight: 3,
    overflow: 'hidden',
    borderRadius: '.25em',
    width: '100%',
    height: '100%',
    
    AFTER: {
        pointerEvents: 'none',
        content: "'\\25BC'",
        
        position: 'absolute',
        top: 0,
        right: 0,
        // padding: '0 1em',
        height: 30,
        lineHeight: 30 + 'px',
        // background: secondaryColor,
        // color: 'white',
        borderRadius: 10,
        
        transition: '.25s all ease'
    }
}

const DROPDOWN_WRAPPER_DESKTOP = {
    ...DROPDOWN_WRAPPER
}

const DROPDOWN = {
    backgroundColor: 'transparent',
    borderStyle: `solid`,
    // borderColor,
    borderWidth: '0px 0px 1px 0px',
    padding: `0px 0px 8px 0px`,
    // margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    // boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
    display: 'inline-block',
    width: '100%',
    height: 30,
    fontSize: 18,
    
    outline: 0,
    appearance: 'none',
    cursor: 'pointer',
    '&:-ms-expand': {
        display: 'none'
    }
}

const DROPDOWN_DESKTOP = {
    ...DROPDOWN
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    QUESTION,
    QUESTION_DESKTOP,
    DROPDOWN_WRAPPER,
    DROPDOWN_WRAPPER_DESKTOP,
    DROPDOWN,
    DROPDOWN_DESKTOP
}