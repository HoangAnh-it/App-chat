const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = new mongoose.Schema(
    {
        name: {
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

User.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

User.methods.checkPassword = async function(password) {
    try {
        const isMath = await bcrypt.compare(password, this.password);
        return isMath;
    } catch (error) {
        console.log(error);
        return false;
    }
}

User.methods.generateToken = function(){
    const payload = {
        id: this._id,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE });
    
    return { 
        accessToken : `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
    }
}

module.exports = mongoose.model('user', User);