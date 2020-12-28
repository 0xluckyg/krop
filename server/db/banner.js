const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    accountId: String,
    name: String,
    domain: String,
    fonts: [String],
    elements: Array,
    mainboard: Object,
    enabled: {
        type: Boolean,
        default: true
    },
    compiled: {
        css: String,
        html: String
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = {Banner};
