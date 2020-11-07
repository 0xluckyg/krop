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
    
    let {props, selectedStage, selectedElement, propertyType, property, value, selectedSectionElement} = options
    
    if (typeof selectedSectionElement === 'number') {
        return modifySectionProperty(options)
    }
    
    let newState = JSON.parse(JSON.stringify(props.state))
    
    if (selectedElement == keys.BACKGROUND || selectedElement == keys.TAB || selectedElement == keys.ALERT) {
        if (property != 'locked' && newState.fixed[selectedElement].locked) return
        if (!propertyType) {
            newState.fixed[selectedElement][property] = value
        } else {
            newState.fixed[selectedElement][propertyType][property] = value
        }
    } else if (selectedElement == keys.MAINBOARD) { 
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
    
    let {props, selectedStage, selectedElement, propertyType, property, selectedSectionElement} = options

    if (typeof selectedSectionElement === 'number') {
        return getSectionProperty(options)
    }
    
     if (Number.isInteger(selectedElement)) {
        if (!propertyType) {
            return props.state.stages[selectedStage]?.elements?.[selectedElement]?.[property]
        } else {
            return props.state.stages[selectedStage]?.elements?.[selectedElement]?.[propertyType]?.[property]      
        }
    } else if (selectedElement == keys.BACKGROUND || selectedElement == keys.TAB || selectedElement == keys.ALERT) {
        if (!propertyType) {
            return props.state.fixed[selectedElement]?.[property]
        } else {
            return props.state.fixed[selectedElement]?.[propertyType]?.[property]
        }
    } else if (selectedElement == keys.MAINBOARD) { 
        if (!propertyType) {
            return props.state.stages[selectedStage]?.[selectedElement]?.[property]
        } else {
            return props.state.stages[selectedStage]?.[selectedElement]?.[propertyType]?.[property]
        }
    }
}

function getElement(options) {
    
    let {props, selectedStage, selectedElement, selectedSectionElement} = options
    if (typeof selectedSectionElement === 'number') {
        return getSectionElement(options)
    }
    
    if (Number.isInteger(selectedElement)) {
        return props.state.stages[selectedStage]?.elements?.[selectedElement]
    } else if (selectedElement == keys.BACKGROUND || selectedElement == keys.TAB || selectedElement == keys.ALERT) {
        return props.state.fixed[selectedElement]
    } else if (selectedElement == keys.MAINBOARD) { 
        return props.state.stages[selectedStage]?.[selectedElement]
    }
}

function modifyElement(options) {
    let {props, selectedStage, selectedElement, element, selectedSectionElement} = options
    
    if (typeof selectedSectionElement === 'number') {
        return modifySectionElement(options)
    }
    
    let newState = JSON.parse(JSON.stringify(props.state))
    if (Number.isInteger(selectedElement)) {
        let prevElement = props.state.stages[selectedStage]?.elements?.[selectedElement]
        if (prevElement.locked) return
        newState.stages[selectedStage].elements[selectedElement] = {...prevElement, ...element}
    } else if (selectedElement == keys.BACKGROUND || selectedElement == keys.TAB || selectedElement == keys.ALERT) {
        let prevElement = newState.fixed[selectedElement]
        if (prevElement.locked) return
        newState.fixed[selectedElement] = {...prevElement, ...element}
    } else if (selectedElement == keys.MAINBOARD) { 
        let prevElement = newState.stages[selectedStage]?.[selectedElement]
        if (prevElement.locked) return
        newState.stages[selectedStage][selectedElement] = {...prevElement, ...element}
    }
    
    props.setState(newState)
    
    return newState
}

function modifySectionProperty(options) {
    const {props, selectedStage, selectedElement, selectedSectionElement, propertyType, property, value} = options
    let newState = JSON.parse(JSON.stringify(props.state))

    if (property != 'locked' && newState.stages[selectedStage].elements[selectedElement].elements[selectedSectionElement].locked) return
    if (!propertyType) {
        newState.stages[selectedStage].elements[selectedElement].elements[selectedSectionElement][property] = value
    } else {
        newState.stages[selectedStage].elements[selectedElement].elements[selectedSectionElement][propertyType][property] = value
    }

    props.setState(newState)
    
    return newState
}

function getSectionProperty(options) {
    const {props, selectedStage, selectedElement, selectedSectionElement, propertyType, property} = options
    if (!propertyType) {
        return props.state.stages[selectedStage]?.elements?.[selectedElement]?.elements?.[selectedSectionElement]?.[property]
    } else {
        return props.state.stages[selectedStage]?.elements?.[selectedElement]?.elements[selectedSectionElement][propertyType]?.[property]      
    }
}

function modifySectionElement(options) {
    const {props, selectedStage, selectedElement, selectedSectionElement, element} = options
    let newState = JSON.parse(JSON.stringify(props.state))
    
    let prevElement = props.state.stages[selectedStage]?.elements?.[selectedElement]?.elements?.[selectedSectionElement]
    if (prevElement.locked) return
    newState.stages[selectedStage].elements[selectedElement].elements[selectedSectionElement] = {...prevElement, ...element}
    props.setState(newState)
    
    return newState
}

function getSectionElement(options) {
    const {props, selectedStage, selectedElement, selectedSectionElement} = options
    return props.state.stages[selectedStage]?.elements?.[selectedElement]?.elements?.[selectedSectionElement]
}

module.exports = {
    handleDisabled, 
    handleLimit, 
    modifyProperty, 
    getProperty, 
    getElement, 
    modifyElement
}