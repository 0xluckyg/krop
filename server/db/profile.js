const mongoose = require('mongoose');
const emailValidator = require("email-validator");

const ProfileSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        index: true
    }, //account _id of the owner
    key: {
        type: String,
        required: true
    }, //key of the owner
    campaignId: {
        type: String,
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    path: String,
    browser: String,
    device: String,
    ip: String,
    // campaignTrigger: String,
    
    profile: {
        tags: [String],
        firstName: String,
        lastName: String,
        organization: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        location: String,
        birthday: Date,
        lastActive: Date,   
        updatedAt: Date
    },
    
    email: {
        value: {
            index: true,
            type: String,
            unique: true,
            sparse: true
        },
        tags: [String],
        read: {
            type: Number,
            default: 0
        },
        bounced: {
            type: Number,
            default: 0
        },
        received: {
            type: Number,
            default: 0
        },
        responded: {
            type: Number,
            default: 0
        },
        unsubscribed: {
            type: Number,
            default: 0
        },
        markedSpam: {
            type: Number,
            default: 0
        },
        lastActive: Date,
        updatedAt: Date,
    },
    
    mobile: {
        value: {
            index: true,
            type: String,
            unique: true,
            sparse: true
        },
        country: String,
        tags: [String],
        read: {
            type: Number,
            default: 0
        },
        bounced: {
            type: Number,
            default: 0
        },
        received: {
            type: Number,
            default: 0
        },
        responded: {
            type: Number,
            default: 0
        },
        blocked: {
            type: Number,
            default: 0
        },
        lastActive: Date,
        updatedAt: Date
    }
    
    
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

ProfileSchema.statics.validate = async function(profile) {
    
    let email
    if (profile.email && profile.email.value) {
        if (!emailValidator.validate(profile.email.value)) {
            return 'Your email is not valid.'
        }
        email = await this.findOne({'email.value': profile.email.value})
    }
    
    let mobile
    if (profile.mobile && profile.mobile.value) {
        mobile = await this.findOne({'mobile.value': profile.mobile.value})
    }
    
    if (email != null && mobile != null) {
        return "Your number and email are already signed up!"
    } else if (email != null) {
        return "Your email is already signed up!"
    } else if (mobile != null) {
        return "Your number is already signed up!"
    } else {
        return false
    }
}

const Profile = mongoose.model('Profiles', ProfileSchema);

module.exports = {Profile};