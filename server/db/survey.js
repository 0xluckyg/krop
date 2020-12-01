const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    accountId: String,
    surveyId: Number,
    domain: String,
    surveyCount: Number,
    stages: Array,
    enabled: {
        type: Boolean,
        default: true
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
        name: 'Survey',
        device: 'both',
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
        stages: [{
            settings: mongoose.Schema.types.mixed,
            elements: [
                {
                    id: String,
                    html: String
                }
            ]
        }],
        alert: String,
        background: String
    },
    views: {
        type: Number,
        default: 0
    },
    submits: {
        type: Number,
        default: 0
    },
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Survey = mongoose.model('Surveys', SurveySchema);

module.exports = {Survey};
