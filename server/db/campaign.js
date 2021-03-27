const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    path: String,
    accountId: String,
    campaignId: Number,
    campaignCount: Number,
    stages: Array,
    isTemplate: {
        type: Boolean,
        default: false
    },
    enabled: {
        type: Boolean,
        default: true
    },
    alert: {
        backgroundColor: String,
        textColor: String,
        popupTextColor: String
    },
    styles: {
        logo: String,
        backgroundColor: String,
        backgroundImage: String,
        primaryColor: String,
        secondaryColor: String,
        textColor: String,
        align: String,
        font: String
    },
    alertMessages: {
        required: String,
        tooLong: String,
        tooShort: String,
        invalid: String,
        popup: String
    },
    settings: {
        name: String,
        device: String,
        schedule: {
            type: {type: String},
            from: Number,
            to: Number,
            fromOverflow: Number,
            toOverflow: Number,
            fromYear: Number,
            toYear: Number,
        },
        importance: {
            type: Number,
            default: 1
        }
    },
    compiled: {
        css: String,
        js: String,
        stages: [{
            settings: mongoose.Schema.Types.Mixed,
            elements: [String]
        }],
        font: String,
        frame: String,
        page: String,
        alert: String,
        alertText: String,
        button: String
    },
    views: {
        type: Number,
        default: 0
    },
    submits: {
        type: Number,
        default: 0
    },
    qr: {
        width: Number,
        height: Number,
        image: String,
        margin: Number,
        imageOptions: {
            imageSize: Number,
            margin: Number,
            hideBackgroundDots: Boolean
        },
        dotsOptions: {
            color: String,
            // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
            type: String,
            gradient: Array
        },
        cornersSquareOptions: {
            color: String,
            // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
            type: String,
            gradient: Array
        },
        cornersDotOptions: {
            color: String,
            // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
            type: String,
            gradient: Array
        },
        backgroundOptions: {
            color: String,
            gradient: Array
        }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Campaign = mongoose.model('Campaigns', CampaignSchema);

module.exports = {Campaign};
