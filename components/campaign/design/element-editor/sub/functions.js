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

function isCampaignElement(element) {
    if (!element) return false
    let campaignElements = [
        keys.MULTIPLE_CHOICE_ELEMENT, keys.CHECKBOX_ELEMENT, keys.DROPDOWN_ELEMENT, keys.SLIDER_ELEMENT, keys.FORM_ELEMENT, keys.EMAIL_ELEMENT,
        keys.PHONE_ELEMENT, keys.ADDRESS_ELEMENT, keys.NAME_ELEMENT, keys.LONG_FORM_ELEMENT
    ]
    return campaignElements.includes(element.type)
}

function requiresButton(elements) {
    let campaignCount = 0
    let formCount = 0
    elements.map(element => {
        if (isCampaignElement(element)) campaignCount++
        if (isFormElement(element)) formCount++
    })
    if (formCount > 0 || campaignCount > 1) {
        return true
    } else {
        return false
    }
}

function isFormElement(element) {
    if (!element) return false
    let formElements = [
        keys.FORM_ELEMENT, keys.EMAIL_ELEMENT, keys.PHONE_ELEMENT, keys.ADDRESS_ELEMENT, keys.NAME_ELEMENT, keys.LONG_FORM_ELEMENT
    ]
    return formElements.includes(element.type)
}

function hasElement(elements, elementType) {
    elements.map(element => {
        if (element.type == elementType) return true
    })
    return false
}

function elementsToPages(elements) {
    let pages = []
    if (!elements) return pages
    let pageCount = 0
    let firstElement = elements[0]
    let previousElement = firstElement
    pages[0] = [firstElement]
    
    for (let i = 1; i < elements.length; i++) {
        let element = elements[i]
        let campaignFlag = isCampaignElement(element)
        let previousFlag = isCampaignElement(previousElement)
        
        if (campaignFlag) {
            pageCount ++
            pages[pageCount] = [element]
        } else {
            if (previousFlag) pageCount ++
            if (!pages[pageCount]) pages[pageCount] = []
            pages[pageCount].push(element)
        }
        
        previousElement = element
    }
    
    return pages
}

function findElementPageIndex(pages, element) {
    let pageIndex = 0
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i]
        for (let j = 0; j < page.length; j++) {
            let pageEl = page[j]
            if (pageEl.id == element.id) {
                return pageIndex
            }
        }
        pageIndex++
    }
    return pageIndex
}

function getStage(options) {
    let {props, selectedStage} = options
    return props.state.stages[selectedStage]
}

function setStage(options) {
    let {props, selectedStage, stage} = options
    return props.state.stages[selectedStage] = stage
}

function getElement(options) {
    let {props, selectedStage, selectedElement} = options

    if (typeof selectedElement == 'number') {
        return props.state.stages[selectedStage].elements[selectedElement]
    } else if (selectedElement == keys.ALERT_SETTINGS) {
        return props.state.alert
    } else if (selectedElement == keys.STAGE_SETTINGS) {
        return props.state.stages[selectedStage].settings
    } else {
        return props.state.styles
    }
}

function setElement(options) {
    let {props, selectedStage, selectedElement, element} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    
    if (typeof selectedElement == 'number') {
        newState.stages[selectedStage].elements[selectedElement] = element
    } else if (selectedElement == keys.ALERT_SETTINGS) {
        newState.state.alert = element
    } else if (selectedElement == keys.STAGE_SETTINGS) {
        newState.stages[selectedStage].settings = element
    } else {
        newState.styles = element
    }
    
    props.setState(newState)
    
    return newState
}

function getProperty(options) {
    let {props, selectedStage, selectedElement, propertyType, property} = options
    
    if (typeof selectedElement == 'number') {
        if (!propertyType) {
            return props.state.stages[selectedStage].elements[selectedElement][property]
        } else {
            return props.state.stages[selectedStage].elements[selectedElement][propertyType][property]
        }
    } else if (selectedElement == keys.ALERT_SETTINGS) {
        if (!propertyType) {
            return props.state.alert[property]
        } else {
            return props.state.alert[propertyType][property]
        }
    } else if (selectedElement == keys.STAGE_SETTINGS) {
        if (!propertyType) {
            return props.state.stages[selectedStage].settings[property]
        } else {
            return props.state.stages[selectedStage].settings[propertyType][property]
        }
    } else {
        if (!propertyType) {
            return props.state.styles[property]
        } else {
            return props.state.styles[propertyType][property]
        }
    }
}

function setProperty(options) {
    let {props, selectedStage, selectedElement, propertyType, property, value} = options
    
    let newState = JSON.parse(JSON.stringify(props.state))
    
    if (typeof selectedElement == 'number') {
        if (!propertyType) {
            newState.stages[selectedStage].elements[selectedElement][property] = value
        } else {
            newState.stages[selectedStage].elements[selectedElement][propertyType][property] = value
        }
    } else if (selectedElement == keys.ALERT_SETTINGS) {
        if (!propertyType) {
            newState.alert[property] = value
        } else {
            newState.alert[propertyType][property] = value
        }
    } else if (selectedElement == keys.STAGE_SETTINGS) {
        if (!propertyType) {
            newState.stages[selectedStage].settings[property] = value
        } else {
            newState.stages[selectedStage].settings[propertyType][property] = value
        }
    } else {
        if (!propertyType) {
            newState.styles[property] = value
        } else {
            newState.styles[propertyType][property] = value
        }
    }
    
    props.setState(newState)
    
    return newState
}

module.exports = {
    handleDisabled, 
    handleLimit, 
    isCampaignElement,
    requiresButton,
    isFormElement,
    elementsToPages,
    findElementPageIndex,
    
    getStage,
    setStage,
    getElement, 
    setElement,
    getProperty,
    setProperty, 
}