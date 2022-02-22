const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
require('dotenv').config();

const UserController = {
    // [GET] /api/user/home
    home: async (req, res, next) => {
        const { id: userId } = req.query;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Something went wrong!',
            });
        }

        res.render('chat-area', {
            data: {
                username: user.name,
                avatar: user.avatar || process.env.DEFAULT_AVATAR,
            }
        });
    }
};

module.exports = UserController;
