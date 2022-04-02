const { StatusCodes } = require('http-status-codes');
const { User, Room, User_Room } = require('../models');
const { trimObj } = require('../utils/object');


const UserController = {
    // [GET] /api/v2/user/profile?userId
    getProfile: async (req, res) => {
        try {
            const userId = req.query.id;
            const user = await User.findOne({
                where: { userId }
            });

            if (!user) {
                throw new Error();
            }

            return res.status(StatusCodes.OK).render('pages/profile.ejs', {
                user: {
                    userId: user.userId,
                    avatar: user.avatar,
                    name: user.name,
                    email: user.email,
                    nickName: user.nickName,
                    address: user.address,
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot find profile. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
    },

    // [POST] /api/v2/user/update-info?userId
    update: (req, res) => {
        const newValue = trimObj(req.body);
        const userId = req.userId;
        User.update(newValue, {
            where: { userId, }
        }).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${userId}`)
        }).catch(error => {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot update profile. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        });
    },

    // [POST] /api/v2/user/create-room
    createRoom: async (req, res) => {
        const admin = req.userId;
        const { roomInfoInput: name, maxUsers } = req.body;
        const newRoom = await Room.create({
            name,
            admin,
            maximum_users: maxUsers === 'unlimited' ? -1 : Number.parseInt(maxUsers),
        });

        if (!newRoom) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'ERROR',
                message: 'Cannot create room!',
                comeTo: 'api/v2/chat',
            });
        } else {
            // add admin as user into room
            // and add room to admin
            const userAsAdmin = await User.findOne({
                where: { userId: admin },
            });
            if (userAsAdmin) {
                newRoom.addUser(userAsAdmin);
                // userAsAdmin.addRoom(newRoom);
            }
                    
            return res.redirect('/api/v2/chat');
        }
                
    },
    
    // [POST] /api/v2/user/join-room
    joinRoom: async (req, res) => {
        const { roomInfoInput: roomId } = req.body;
        const userId = req.session.auth?.user._id || req.session.passport?.user._id;
        const room = await Room.findOne({
            where: { roomId },
            include: [User],
        });
        if (!room) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'NOT FOUND',
                message: 'Room not found!',
                comeTo: 'api/v2/chat',
            });
        }

        const isAlreadyMember = room.users.some(user => {
            return userId === user.userId;
        });

        if (isAlreadyMember) {
            // if you are already a member
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: '!!!',
                message: 'You are already a member!',
                comeTo: 'api/v2/chat',
            });
        } else {
            // if you are not a member, join room
            if (room.maxUsers !== -1 && room.users.length > room.maxUsers) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                    title: 'Cannot join room',
                    message: 'This room is already full!',
                    comeTo: 'api/v2/chat',
                });
            }

            const you = await User.findOne({ where: { userId } });
            if (you) {
                room.addUser(you);
            }

            return res.json(room);
        }
    },

    // [DELETE] /api/v2/room/leave-room?roomId
    leaveRoom: async (req, res) => {
        try {
            const roomId = req.query.roomId;
            const userId = req.userId;
            await User_Room.destroy({
                where: { roomId, userId }
            });

            return res.redirect('/api/v2/chat');

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot leave room. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
    }
}

module.exports = UserController;
