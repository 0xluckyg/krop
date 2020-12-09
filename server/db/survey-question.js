const mongoose = require('mongoose');

const SurveyQuestionSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    }, //account _id of the owner
    questionId: {
        type: String,
        required: true,
        unique: true
    },
    surveyId: {
        type: String,
        index: true
    },
    surveyName: {
        type: String
    },

    question: String,
    options: [String],
    type: String
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const SurveyQuestion = mongoose.model('SurveyQuestion', SurveyQuestionSchema);

module.exports = {SurveyQuestion};