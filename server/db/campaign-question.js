const mongoose = require('mongoose');

const CampaignQuestionSchema = new mongoose.Schema({
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
    campaignId: {
        type: String,
        index: true
    },
    campaignName: {
        type: String
    },

    question: String,
    options: [mongoose.Schema.Types.Mixed],
    type: String
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const CampaignQuestion = mongoose.model('CampaignQuestion', CampaignQuestionSchema);

module.exports = {CampaignQuestion};