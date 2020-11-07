const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';

console.log('env ********', env);

const envConfig = config[env];

//Gets keys from config.json file and saves them to process environment variables
//Only env variables that will also be available to the frontend. Backend env variables are saved in .env for dev and aws for production
Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
});