const withCSS = require('@zeit/next-css');
require('dotenv').config()
const Dotenv = require('dotenv-webpack')

const path = require('path')

//Writing on next.config.js file overrides the default next.js config settings
//Allowing use of .css files for react-draft-wysiwyg module
module.exports = withCSS({
    webpack: (config, options) => {

        config.plugins = config.plugins || []

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            })
        ]

        return config
    }
});