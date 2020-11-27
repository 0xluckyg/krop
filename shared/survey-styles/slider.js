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


const SLIDER = {
    TRACK: {
        height: 1,
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
    CONTAINER,
    CONTAINER_DESKTOP,
    QUESTION,
    QUESTION_DESKTOP,
    SLIDER,
    SLIDER_DESKTOP
}