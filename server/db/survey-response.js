const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    }, //account _id of the owner
    surveyId: {
        type: String,
        required: true
    },
    campaignId: {
        type: String,
        index: true
    },
    profileId: {
        type: String,
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    path: String,
    browser: String,
    device: String,
    ip: String, // not saved for now
    
    surveyCount: Number,
    question: String,
    options: [String],
    type: String,
    value: mongoose.Schema.Types.Mixed,
    valueSearchId: String
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);

module.exports = {SurveyResponse};