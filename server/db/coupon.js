const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    accountId: {
        type: String,
        index: true
    },
    couponId: {
        type: String,
        index: true
    },
    campaignId: {
        type: String,
        index: true
    },
    domain: String,
    html: String,
    css: String,
    views: Number,
    sends: Number,
    expiration: Number,
    coordinates: Array,
    views: {
        type: Number,
        default: 0
    },
    sends: {
        type: Number,
        default: 0
    },
    uses: {
        type: Number,
        default: 0
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Coupon = mongoose.model('Coupons', CouponSchema);

module.exports = {Coupon};
