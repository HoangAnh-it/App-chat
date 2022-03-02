const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
require('dotenv').config();
// [GET] /api/user/chat-area

const UserController = {
    
    home: async (req, res, next) => {
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Something went wrong!',
            });
        }

        res.render('chat-area', {
            data: {
                userId: user._id,
                username: user.name,
                avatar: user.avatar,
            }
        });
    },

    // [GET] api/user/profile?id
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
                    avatar: user.avatar,

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

    // [POST] /api/user/update-info/:id
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
