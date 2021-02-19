const mongoose = require('mongoose');

const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const keys = require('../../config/keys')

const UserSchema = new mongoose.Schema({
    type: {
        //google, organic, etc
        type: String,
        default: "organic"
    },
    admin: {
        type: Boolean,
        default: false
    },
    privilege: {
        //0~100 in discount. Free users get 100 privilege 
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    referredBy: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: ''
    },
    domain: {
        type: String,  
        unique: true,
        sparse: true
    },
    //whether the user is verified and active
    active: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        //implemented using validator library
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    },
    password: {
        type: String,
        minlength: 6,
    },
    //unique access token for each store from Shopify.
    //When access mode is set to "offline", Shopify returns the same accessToken until uninstalled
    accessToken: {
        unique: true,
        sparse: true,
        type: String
    },
    //recurring subscription model
    payment: {
        plan: {
            type: Number
        },
        accepted: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        },
        subscriptionId: String,
        receiptUrl: String
    },
    primaryColor: {
        type: String,
        default: keys.DEFAULT_PRIMARY_COLOR
    },
    secondaryColor: {
        type: String,
        default: keys.DEFAULT_SECONDARY_COLOR
    },
    //reset every month
    views: {
        updatedAt: {
            type: Date,
            default: Date.now
        },
        count: {
            type: Number,
            default: 0
        }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

UserSchema.methods.generateAuthToken = async function() {
    try {
        //Arrow function does not bind 'this' keyword.
        const user = this;
        const token = jwt.sign({
            _id: user._id.toHexString()
        }, process.env.JWT_SECRET).toString();
    
        user.accessToken = token
    
        await user.save()
        
        return token   
    } catch(err) {
        console.log("Failed generateAuthToken: ", err)
        return Promise.reject();
    }
};

UserSchema.methods.removeToken = async function() {
    try {
        const user = this;

        await user.update({
            $unset: {
                accessToken: ''
            }
        });   
    } catch(err) {
        console.log("Failed removeToken: ", err)
        return Promise.reject();
    }
};

//Statics turns into a model method instead of an instance method
UserSchema.statics.findByJwt = async function(token) {
    try {
        const User = this;
        let decoded;
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findOne({
            _id: decoded._id,
            accessToken: token
        });
    } catch (err) {
        console.log("Failed findByJwt: ", err)
        return Promise.reject();
    }
};

//Statics turns into a model method instead of an instance method
UserSchema.statics.findByToken = async function(token) {
    try {
        const User = this;
        return await User.findOne({
            accessToken: token
        });
    } catch (err) {
        console.log("Failed findByToken: ", err)
        return Promise.reject();
    }
};

UserSchema.statics.findByCredentials = async function(email, password) {
    try {
        const User = this;
        
        const user = await User.findOne({email})

        if (!user) {
            return Promise.reject('no user');
        }
        
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    console.log('Failed findByCredentials password validation', err)
                    reject('wrong password');
                }
            });
        });   
    } catch(err) {
        console.log("Failed to findByCredentials: ", err)
    }
};

//Run middleware before 'save' operation
UserSchema.pre('save', function(next) {
    const user = this;
    //Checks if password was modified
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//Creating a new user example
const User = mongoose.model('Users', UserSchema);

module.exports = {User};
