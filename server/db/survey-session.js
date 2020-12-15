const mongoose = require('mongoose');

const SurveySessionSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    },
    surveyId: {
        type: String,
        index: true
    },
    sessionId: {
        unique: true,
        type: String,
        index: true
    },
    clientId: {
        type: String,
        index: true
    },
    address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    phone: String,
    email: String,
    name: {
        firstName: String,
        lastName: String
    },
    hasProfile: Boolean,
    path: String,
    browser: String,
    device: String,
    ip: String // not saved for now
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveySession = mongoose.model('SurveySession', SurveySessionSchema);

module.exports = {SurveySession};