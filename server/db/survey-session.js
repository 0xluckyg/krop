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
    path: String,
    browser: String,
    device: String,
    ip: String // not saved for now
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveySession = mongoose.model('SurveySession', SurveySessionSchema);

module.exports = {SurveySession};