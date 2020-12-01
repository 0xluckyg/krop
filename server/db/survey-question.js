const mongoose = require('mongoose');

const SurveyQuestionSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    }, //account _id of the owner
    surveyId: {
        type: String,
        required: true,
        unique: true
    },
    campaignId: {
        type: String,
        index: true
    },
    campaignName: {
        type: String
    },

    question: String,
    questionSearchId: String,
    options: [String],
    type: String
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveyQuestion = mongoose.model('SurveyQuestion', SurveyQuestionSchema);

module.exports = {SurveyQuestion};