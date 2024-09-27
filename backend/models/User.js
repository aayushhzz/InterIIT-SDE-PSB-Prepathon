const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{ 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    twoFAEnabled: {
        type: Boolean,
        default: false
    },
    tempsecret: {
        type: String,
        required: false
    },
    secret: {
        type: String,
        required: false
    },
    challenge: {
        type: String,
        required : false
    },
    loginchallenge: {
        type: String,
        required : false
    },
    passkey : {
        type: Object,
        required : false
    }
});

module.exports = mongoose.model('User', UserSchema);
