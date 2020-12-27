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
    
    let {props, selectedStage, selectedElement, propertyType, property, value} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        if (property != 'locked' && newState.stages[selectedStage][selectedElement].locked) return
        if (!propertyType) {
            newState.stages[selectedStage][selectedElement][property] = value
        } else {
            newState.stages[selectedStage][selectedElement][propertyType][property] = value
        }
    } else {
        if (property != 'locked' && newState.stages[selectedStage].elements[selectedElement].locked) return
        if (!propertyType) {
            newState.stages[selectedStage].elements[selectedElement][property] = value
        } else {
            newState.stages[selectedStage].elements[selectedElement][propertyType][property] = value
        }
    }
    props.setState(newState)
    
    return newState
}

function getProperty(options) {
    
    let {props, selectedStage, selectedElement, propertyType, property} = options
    console.log("OO: ", props.state.stages[selectedStage].elements[selectedElement])
    console.log("2: ", {propertyType, property})
     if (Number.isInteger(selectedElement)) {
        if (!propertyType) {
            return props.state.stages[selectedStage].elements[selectedElement][property]
        } else {
            return props.state.stages[selectedStage].elements[selectedElement][propertyType][property]      
        }
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        if (!propertyType) {
            return props.state.stages[selectedStage][selectedElement][property]
        } else {
            return props.state.stages[selectedStage][selectedElement][propertyType][property]
        }
    }
}

function getElement(options) {
    
    let {props, selectedStage, selectedElement} = options
    if (Number.isInteger(selectedElement)) {
        return props.state.stages[selectedStage].elements[selectedElement]
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        return props.state.stages[selectedStage][selectedElement]
    }
}

function modifyElement(options) {
    let {props, selectedStage, selectedElement, element} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    if (Number.isInteger(selectedElement)) {
        let prevElement = props.state.stages[selectedStage].elements[selectedElement]
        if (prevElement.locked) return
        newState.stages[selectedStage].elements[selectedElement] = {...prevElement, ...element}
    } else if (selectedElement == keys.MAINBOARD_ELEMENT) { 
        let prevElement = newState.stages[selectedStage][selectedElement]
        if (prevElement.locked) return
        newState.stages[selectedStage][selectedElement] = {...prevElement, ...element}
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