require('./config/config')
const withCSS = require('@zeit/next-css');

//Writing on next.config.js file overrides the default next.js config settings
//Allowing use of .css files for react-draft-wysiwyg module
module.exports = withCSS({});