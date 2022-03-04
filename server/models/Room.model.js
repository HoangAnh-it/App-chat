const mongoose = require('mongoose');

const Room = new mongoose.Schema(
    {
        name: {
            type: String,
            default: '_room_',
            trim:true,
        },

        members: {
            type: [mongoose.Types.ObjectId],
            ref:'user',
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model('room', Room);
