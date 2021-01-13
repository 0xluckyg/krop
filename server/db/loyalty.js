const mongoose = require('mongoose');

const LoyaltySchema = new mongoose.Schema({
    customerId: {
        type: String,
        index: true
    },
    accountId: {
        type: String,
        index: true
    },
    loyaltyId: {
        type: String,
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },

    reset: Number,
    count: {
        type: Number,
        required: true
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Order = mongoose.model('Loyalties', LoyaltySchema);

module.exports = {Order};
