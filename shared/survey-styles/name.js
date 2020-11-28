const CONTAINER = {
    margin: '30px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
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


const FRONT_NAME = {
    marginRight: 20
}

const FRONT_NAME_DESKTOP = {
    ...FRONT_NAME
}

const NAME = {
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

const NAME_DESKTOP = {
    ...NAME
}

module.exports = {
    CONTAINER,
    CONTAINER_DESKTOP,
    QUESTION,
    QUESTION_DESKTOP,
    FRONT_NAME,
    FRONT_NAME_DESKTOP,
    NAME,
    NAME_DESKTOP
}