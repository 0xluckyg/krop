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
    profileId: {
        type: String,
        index: true
    },
    sessionId: {
        unique: true,
        type: String,
        index: true
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveySession = mongoose.model('SurveySession', SurveySessionSchema);

module.exports = {SurveySession};