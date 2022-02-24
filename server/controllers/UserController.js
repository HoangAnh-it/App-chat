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
                userId,
                username: user.name,
                avatar: user.avatar || process.env.DEFAULT_AVATAR,
            }
        });
    },

    profile: async (req, res) => {
        try {
            const { id: userId } = req.query;
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Profile not found',
                });
            }

            return res.render('user/profile', {
                data: {
                    userId,
                    username: user.name,
                    avatar: user.avatar || process.env.DEFAULT_AVATAR,

                    nickname: user.nickname,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                },
                
            });
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Something went wrong!',
            });
        }
    },

    updateInfo: (req, res) => {
        const userId = req.params.id;
        const newData = req.body;
        User.findOneAndUpdate({ _id: userId }, newData)
            .then(() => {
                return res.redirect(`/api/user/profile?id=${userId}`)
            })
            .catch(console.error);
        
    },

    // [GET] /api/user/logout
    logout: (req, res) => {
        req.session.destroy(console.err);
        res.clearCookie('access_token');
        return res.redirect('/api/login');
    }
};

module.exports = UserController;
