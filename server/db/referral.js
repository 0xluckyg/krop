const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
    accountId: {
        type: String,
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    campaignId: {
        type: String,
        index: true
    },
    clientId: {
        type: String,
        index: true
    },
    couponId: {
        type: String,
        index: true
    },
    
    referralId: {
        type: String,
        index: true
    },
    domain: String,

    uses: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    expiration: {
        type: Number
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Referral = mongoose.model('Referrals', ReferralSchema);

module.exports = {Referral};
