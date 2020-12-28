const keys = require('../../../../../config/keys')

function handleDisabled(props, property) {
    const {disabled} = props
    return (disabled && disabled.includes(property)) ? true : false
}
    
function handleLimit(value, min, max) {
    //if contains space, false
    if (/\s/g.test(value)) return false
    
    //if is an empty string or minus symbol, true
    if (value == '' || value == '-') return true
    
    //all other non numbers if false
    if (isNaN(value)) return false
    
    //check the range
    if (!max && min) {
        return (value >= min)
    } else if (!min && max) {
        return (value <= max)
    } else if (!min && !max) {
        return true
    } else {
        return (value >= min && value <= max)   
    }
}

function modifyProperty(options) {
    
    let {props, selectedElement, propertyType, property, value} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        if (property != 'locked' && newState[selectedElement].locked) return
        if (!propertyType) {
            newState[selectedElement][property] = value
        } else {
            newState[selectedElement][propertyType][property] = value
        }
    } else {
        if (property != 'locked' && newState.elements[selectedElement].locked) return
        if (!propertyType) {
            newState.elements[selectedElement][property] = value
        } else {
            newState.elements[selectedElement][propertyType][property] = value
        }
    }
    props.setState(newState)
    
    return newState
}

function getProperty(options) {
    
    let {props, selectedElement, propertyType, property} = options
     if (Number.isInteger(selectedElement)) {
        if (!propertyType) {
            return props.state.elements[selectedElement][property]
        } else {
            return props.state.elements[selectedElement][propertyType][property]      
        }
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        if (!propertyType) {
            return props.state[selectedElement][property]
        } else {
            return props.state[selectedElement][propertyType][property]
        }
    }
}

function getElement(options) {
    
    let {props, selectedElement} = options
    if (Number.isInteger(selectedElement)) {
        return props.state.elements[selectedElement]
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        return props.state[selectedElement]
    }
}

function modifyElement(options) {
    let {props, selectedElement, element} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    if (Number.isInteger(selectedElement)) {
        let prevElement = props.state.elements[selectedElement]
        if (prevElement.locked) return
        newState.elements[selectedElement] = {...prevElement, ...element}
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        let prevElement = newState[selectedElement]
        if (prevElement.locked) return
        newState[selectedElement] = {...prevElement, ...element}
    }
    
    props.setState(newState)
    
    return newState
}

module.exports = {
    handleDisabled, 
    handleLimit, 
    modifyProperty, 
    getProperty, 
    getElement, 
    modifyElement
}