const mongoose = require('mongoose');
require('dotenv').config();

const User = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        require: true,
    },

    avatar: {
        type: String,
        default: process.env.DEFAULT_AVATAR,
    }
},
{
    timestamp: true,
}
);

module.exports = mongoose.model('user', User);