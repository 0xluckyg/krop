const withCSS = require('@zeit/next-css');
require('dotenv').config()
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack');

const path = require('path')

//Writing on next.config.js file overrides the default next.js config settings
//Allowing use of .css files for react-draft-wysiwyg module
module.exports = withCSS({
    webpack: (config, options) => {
        const env = Object.keys(process.env).reduce((acc, curr) => {
            acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
            return acc;
        }, {});

        // Fixes npm packages that depend on `fs` module
        config.node = {
            fs: 'empty'
        };

        config.plugins = config.plugins || []
        config.plugins.push(new webpack.DefinePlugin(env));

        // config.plugins = [
        //     ...config.plugins,

        //     // Read the .env file
        //     new Dotenv({
        //         path: path.join(__dirname, '.env'),
        //         systemvars: true
        //     })
        // ]
        return config
    }
});