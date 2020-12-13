const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createClassName} = require('../compiler/functions')
const longFormStyles = require('../../../shared/survey-styles/long-form')
const {textClass, compileElementContainerHTML, compileQuestionHTML} = require('./reusable')

const longFormClass = createClassName({
    type: 'textarea',
    uid: shortid.generate()
})

function compileLongFormHTML(options) {
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {element} = options
    
    let container = compileElementContainerHTML()
    container.setAttribute('id', element.id)
    container.setAttribute('type', element.type)
    
    let question = compileQuestionHTML()
    question.innerHTML = element.question
    container.appendChild(question)
    
    let input = document.createElement('textarea');
    input.setAttribute('class', textClass + " " + longFormClass)
    input.setAttribute('placeholder', 'Please put your answer here')
    container.appendChild(input)

    return container
}

function compileLongFormCSS(options) {
    const {textColor} = options.styles
    
    let longFormCSS = getCSS(longFormClass, {
        ...longFormStyles.LONG_FORM,
        color: textColor,
        borderColor: textColor
    })
    let longFormFocusCSS = getCSS(longFormClass+":focus", {
        ...longFormStyles.LONG_FORM.FOCUS
    })
    let longFormPlaceholderCSS = getCSS(longFormClass+"::placeholder", {
        ...longFormStyles.LONG_FORM.PLACEHOLDER,
        color: textColor
    })

    return longFormCSS+longFormFocusCSS+longFormPlaceholderCSS 
}

function compileLongFormJS(options) {
    function autosizeTextarea() {
        const tx = document.getElementsByTagName('textarea');
        for (let i = 0; i < tx.length; i++) {
            // tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
            tx[i].addEventListener("input", function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            }, false);
        }
    }
    
    return autosizeTextarea.toString() + 'autosizeTextarea()'
}

module.exports = {compileLongFormHTML, compileLongFormCSS, compileLongFormJS}