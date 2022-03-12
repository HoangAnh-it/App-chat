const { StatusCodes } = require('http-status-codes');
const roomController = require('./RoomController');
const { multipleToObject } = require('../helpers/mongoose');
const { User } = require('../models');
require('dotenv').config();

const UserController = {
    
    // [GET] /api/user/chat-area
    home: async (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).render('status', {
                notification: {
                    title: 'Error',
                    message: 'Something went wrong! Please try again',
                }
            });
        }
        const allRooms = await user.getAllRooms();

        const partner = await User.findOne({})

        res.render('chat-area', {
            data: {
                userId: user._id,
                username: user.name,
                avatar: user.avatar,
                rooms: multipleToObject(allRooms),
                partner: partner,
            }
        });
    },

    // [GET] api/user/profile?id
    profile: async (req, res) => {
        try {
            const { id: userId } = req.query;
            const isSelf = req.query.isSelf;
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).render('status', {
                    notification: {
                        title: 'Not found',
                        message: 'Could not find your profile',
                    }
                })
            }

            return res.render('user/profile', {
                data: {
                    isSelf: isSelf,
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
            return res.status(StatusCodes.BAD_REQUEST).render('status', {
                notification: {
                    title: 'Error',
                    message: 'Something went wrong! Please try again',
                }
            })
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
    },

    // [POST] /api/user/room
    roomAction: async (req, res) => {
        const { action, infoRoom } = req.body;
        const user = req.user;
        
        try {
            switch (action) {
                case 'create':
                    await roomController.createRoom(infoRoom, user);
                    break;
                
                case 'join':
                    await roomController.joinRoom(infoRoom, user);
                    break;
                
                case 'leave':
                    await roomController.leaveRoom(infoRoom?.split('-')[1], user);
                    break;
                
                default: break;
            }

            return res.redirect('/api/user/chat-area');
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).render('status', {
                notification: {
                    title: 'Error',
                    message: `${error.message}`,
                }
            });
        }
    },
};

module.exports = UserController;
