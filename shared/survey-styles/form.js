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


const FORM = {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
    borderWidth: `0px 0px 0.5px 0px`,
    borderStyle: `solid`,
    padding: `0px 0px 8px 0px`,
    borderColor: 'black',
    fontSize: 18,
    FOCUS: {
        outline: 'none'  
    },
    PLACEHOLDER: {
        color: 'gray',
        fontSize: 18,
    }
}

const FORM_DESKTOP = {
    ...FORM
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    QUESTION,
    QUESTION_DESKTOP,
    FORM,
    FORM_DESKTOP
}