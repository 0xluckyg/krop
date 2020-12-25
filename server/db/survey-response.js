const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    }, //account _id of the owner
    questionId: {
        type: String,
        required: true
    },
    surveyId: {
        type: String,
        index: true
    },
    sessionId: {
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
    ip: String, // not saved for now

    question: String,
    min: Number,
    max: Number,
    options: [String],
    tags: [String],
    type: String,
    value: mongoose.Schema.Types.Mixed,
    consent: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);

module.exports = {SurveyResponse};