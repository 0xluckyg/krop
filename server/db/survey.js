const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    path: String,
    accountId: String,
    surveyId: Number,
    surveyCount: Number,
    stages: Array,
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
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Survey = mongoose.model('Surveys', SurveySchema);

module.exports = {Survey};
