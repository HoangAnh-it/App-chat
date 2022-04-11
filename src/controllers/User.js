const { StatusCodes } = require('http-status-codes');
const { User, Room, User_Room, User_User, Op } = require('../models');
const { trimObj } = require('../utils/object');
const {
    CustomError,
    NotFoundError,
    ConflictError,
    BadRequestError,
} = require('../error');

const UserController = {
    // [GET] /api/v2/user/profile?userId
    getProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const otherId = Number(req.query.id);
            const isYourProfile = userId === otherId;
            
            const user = await User.findOne({ where: { userId } });

            const payload = {};
            let profileUser = undefined;
            if (!isYourProfile) {
                const anotherUser = await User.findOne({ where: { userId: otherId } });

                const associatedUser = await User_User.findOne({
                    where: {
                        [Op.or]: [
                            {
                                userReqId: userId,
                                userResId: otherId,
                            },
                            {
                                userReqId: otherId,
                                userResId: userId,
                            }
                        ]
                    }
                });

                if (associatedUser) {
                    payload.userRole = associatedUser.userReqId === userId ? 'userReq' : 'userRes';    
                }
                profileUser = anotherUser;
                payload.status = associatedUser ? associatedUser.status : 'none';

            } else {
                profileUser = user;
            }

            payload.profile = {
                id: profileUser.userId,
                avatar: profileUser.avatar,
                name: profileUser.name,
                email: profileUser.email,
                nickName: profileUser.nickName,
                address: profileUser.address,
            };
            payload.userId = userId;
            payload.isYourProfile = isYourProfile;

            return res.status(StatusCodes.OK).render('pages/profile.ejs', payload);

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
            where: { userId }
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
        try {
            const admin = req.userId;
            const { roomInfoInput: name, maxUsers } = req.body;
            const newRoom = await Room.create({
                name,
                admin,
                maximum_users: maxUsers === 'unlimited' ? -1 : Number.parseInt(maxUsers),
            });
    
            if (!newRoom) {
                return new CustomError('!!!', 'Something went wrong.');
            } else {
                // add admin as user into room
                // and add room to admin
                const userAsAdmin = await User.findOne({
                    where: { userId: admin },
                });
                if (userAsAdmin) {
                    newRoom.addUser(userAsAdmin);
                }
                        
                return res.redirect('/api/v2/chat');
            }
            
        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/chat',
            })
        }
                
    },
    
    // [POST] /api/v2/user/join-room
    joinRoom: async (req, res) => {
        try {
            const { roomInfoInput: roomId } = req.body;
            const userId = req.session.auth?.user._id || req.session.passport?.user._id;
            const room = await Room.findOne({
                where: { roomId },
                include: [User],
            });
            if (!room) {
                throw new NotFoundError('Not found', 'Room with this id is not found');
            }

            const isAlreadyMember = room.users.some(user => {
                return userId === user.userId;
            });

            if (isAlreadyMember) {
                // if you are already a member
                throw new ConflictError('Conflict', 'You are already a member.');
            } else {
                // if you are not a member, join room
                if (room.maxUsers !== -1 && room.users.length > room.maxUsers) {
                    throw new BadRequestError('Cannot join!', 'This room is already full.');
                }

                const you = await User.findOne({ where: { userId } });
                if (you) {
                    room.addUser(you);
                }

                return res.redirect('/api/v2/chat');
            }

            
        } catch (error) {
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/chat',
            })
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
    },

    // [POST] /api/v2/user/send-friend-request
    sendFriendRequest: async (req, res) => {
        try {
            const userReqId = req.userId;
            const userResId = req.body.otherId;
            const userReq = await User.findOne({ where: { userId: userReqId } });
            const userRes = await User.findOne({ where: { userId: userResId } });
            if (!userReq || !userRes) {
            
                throw new BadRequestError('ERROR', 'Cannot send request. Something went wrong!');
            }
        
            userReq.addUserRes(userRes)
            return res.redirect(`/api/v2/user/profile?id=${userReqId}`);
        
        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `/api/v2/user/profile?id=${userResId}`,
            });
        }
    },

    // [POST]  /api/v2/user/cancel-friend-request
    cancelOrDeleteFriendRequest: async (req, res) => {
        try {
            const userId = req.userId;
            const otherId = req.body.otherId;
            await User_User.destroy({
                where: {
                    [Op.or]: [
                        {
                            userReqId: userId,
                            userResId: otherId,
                            status: 'pending',
                        },
                        {
                            userReqId: otherId,
                            userResId: userId,
                            status: 'pending',
                        }
                    ]
                }
            });
            
            return res.redirect(`/api/v2/user/profile?id=${userId}`);

        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `/api/v2/chat`,
            });
        }
    },

    // [POST]  /api/v2/user/confirm-friend-request
    confirmFriendRequest: async (req, res) => {
            const userId = req.userId;
            const otherId = req.body.otherId;
        User_User.update(
            { status: 'friend' },
            {
                where: {
                    userReqId: otherId,
                    userResId: userId,
                    status: 'pending',
                }
            }
        ).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${otherId}`);
        }).catch(error => {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `/api/v2/chat`,
            });
        });
    },
    
    unfriend: async (req, res) => {
        const userId = req.userId;
        const otherId = req.body.otherId;
        User_User.destroy({
            where: {
                [Op.or]: [
                    {
                        userReqId: userId,
                        userResId: otherId,
                        status: 'friend',
                    },
                    {
                        userReqId: otherId,
                        userResId: userId,
                        status: 'friend',
                    }
                ]
            }
        }).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${otherId}`);
        }).catch(error => {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `/api/v2/chat`,
            });
        })
    },
}

module.exports = UserController;
