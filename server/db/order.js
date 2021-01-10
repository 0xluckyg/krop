const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    accountId: String,
    imageUrl: String,
    bannerId: String,
    count: {
        type: Number,
        required: true
    },
    //unprocessed, processing, shipping, processed, archived
    status: {
        type: String,
        default: 'unprocessed'
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Order = mongoose.model('Orders', OrderSchema);

module.exports = {Order};
