const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const mcStyles = require('../../../shared/survey-styles/multiple-choice')


function compileMultipleChoiceHTML(options) {
    return ''
}

function compileMultipleChoiceCSS(options) {
    return ''
}

module.exports = {compileMultipleChoiceHTML, compileMultipleChoiceCSS}