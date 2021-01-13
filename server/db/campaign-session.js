const { stubTrue } = require('lodash');
const mongoose = require('mongoose');

const CampaignSessionSchema = new mongoose.Schema({
    customerId: {
        type: String,
        index: true
    },
    accountId: {
        type: String,
        required: true,
        index: true
    },
    campaignId: {
        type: String,
        index: true
    },
    campaignName: {
        type: String
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

const CampaignSession = mongoose.model('CampaignSession', CampaignSessionSchema);

module.exports = {CampaignSession};