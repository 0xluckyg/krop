const mongoose = require('mongoose');

const MediaTemplateSchema = new mongoose.Schema({
    accountId: String,
    index: {
        type: Number,
        default: 0
    },
    key: String,
    //Media, 
    templateType: String,
    //svg, url, video, etc
    mediaType: {type: String},
    //illustration, icon, photo, etc
    category: String,
    source: String,
    name: String,
    tags: [String],
    enabled: {
        type: Boolean,
        default: true
    },
    width: Number,
    height: Number,
    media: String,
    mediaLarge: String,
    mediaSmall: String
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const MediaTemplate = mongoose.model('MediaTemplates', MediaTemplateSchema);

module.exports = {MediaTemplate};
