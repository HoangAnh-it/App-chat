const { Room, User, User_Room } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { CustomError, NotFoundError, ConflictError, BadRequestError } = require('../error');
const { trimObj } = require('../utils/object');

const RoomController = {

    // [GET] /api/v2/room/edit?id
    formEditRoom: async(req, res) => {
        try {
            const userId = req.userId;
            const roomId = req.query.id;
            const room = await Room.findOne({
                where: { roomId },
                include: [
                    {
                        model: User,
                        attributes: ['userId', 'name', 'avatar'],
                    }
                ]
            });
            if (!room) {
                throw new NotFoundError('Not found', 'Cannot find this room.');
            }

            const allUserIds = room.users.map(user => user.dataValues.userId);
            if (!allUserIds.includes(userId)) {
                throw new NotFoundError('Not found', 'You are not member of this room.');
            }

            const adminId = room.admin;
            const admin = await User.findOne({ where: { userId: adminId } });
            if (!admin) {
                throw new NotFoundError('Not found', 'Cannot find admin of this room.');
            }
            const isAdmin = adminId === req.userId;

            return res.status(StatusCodes.OK).render('pages/editRoom.ejs', {
                userId,
                room,
                admin: {
                    id: admin.userId,
                    name: admin.name,
                    avatar: admin.avatar,
                },
                members: room.users,
                isAdmin,
            });
            
        } catch (error) {
            console.log(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
    },

    // [POST] /api/v2/room/create
    createRoom: async (req, res) => {
        try {
            const admin = req.userId;
            const { roomInfoInput: name, maxUsers } = req.body;
            const userAsAdmin = await User.findOne({
                where: {
                    userId: admin,
                },
                include: [{
                    model: Room,
                },]
            });

            // if name of room is already existing
            let allRooms = await userAsAdmin.getRooms();
            allRooms = allRooms.map(room => room.dataValues.name);
            if (allRooms.includes(name)) {
                throw new ConflictError('Duplicated', 'This name of room is already in used');
            }

            const newRoom = await Room.create({
                name,
                admin,
                maximum_users: maxUsers,
            });
    
            if (!newRoom) {
                return new CustomError('!!!', 'Something went wrong.');
            } else {
                // add admin as user into room
                // and add room to admin
                if (userAsAdmin) {
                    newRoom.addUser(userAsAdmin);
                }
                        
                // return res.sendStatus(StatusCodes.OK);
                return res.redirect('/api/v2/chat');
            }
            
        } catch (error) {
            console.log(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status.ejs',{
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
                
    },

     // [POST] /api/v2/room/join
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

            console.log(room);

            if (isAlreadyMember) {
                // if you are already a member
                throw new ConflictError('Conflict', 'You are already a member.');
            } else {
                // if you are not a member, join room
                console.log(room.users.length);
                console.log(room.maximum_users);
                if (room.maximum_users !== 'unlimited' && room.users.length + 1 > Number(room.maximum_users)) {
                    throw new BadRequestError('Cannot join!', 'This room is already full.');
                }

                const you = await User.findOne({ where: { userId } });
                // if name of room is already existing
                let allRooms = await you.getRooms();
                allRooms = allRooms.map(room => room.dataValues.name);
                if (allRooms.includes(room.name)) {
                    throw new ConflictError('Duplicated', 'You already had a room with that name.');
                }
                
                if (you) {
                    room.addUser(you);
                }

                return res.redirect('/api/v2/chat');
            }

            
        } catch (error) {
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            })
        }
    },

    // [DELETE] /api/v2/room/leave?roomId
    leaveRoom: async (req, res) => {
        try {
            const roomId = req.query.roomId;
            const userId = req.userId;
            await User_Room.destroy({
                where: { roomId, userId }
            });
            return res.sendStatus(StatusCodes.OK);

        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                title: 'Error!',
                message: 'Cannot leave room. Something went wrong!',
                directTo: 'back',
            });
        }
    },

    // [PATCH] /api/v2/room/update-info?id
    updateInfo: async (req, res) => {
        const roomId = req.query.id;
        try {
            const newValue = trimObj(req.body);
            const room = await Room.findOne({
                where: { roomId },
                include: [
                    {
                        model: User,
                    }
                ]
            });
            if ('maximum_users' in newValue && newValue.maximum_users !== 'unlimited') {
                newValue.maximum_users = Number(newValue.maximum_users);
                if (newValue.maximum_users < room.users.length) {
                    throw new CustomError('Oversized maximum_users', 'Cannot update size of room less than the users of room');
                }
            }

            await Room.update(newValue, { where: { roomId } });
            return res.redirect(`/api/v2/room?id=${roomId}`);
        } catch (error) {
            console.log(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: `/api/v2/room?id=${roomId}`,
            });
        }
    },

    // [PATCH] /api/v2/room/update-avatar?id
    updateAvatar: async (req, res) => {
        console.log(req.file);
        try {
            const roomId = req.query.id;
            const newAvatar = `/images/upload/group/${req.file.filename}`;
            await Room.update({
                avatar: newAvatar,
            },
                {
                    where: { roomId }
                });
        
            return res.status(StatusCodes.OK).redirect(`/api/v2/room?id=${roomId}`);
            
        } catch (error) {
            console.error(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
    },

    // [DELETE] /api/v2/room/remove-user
    removeUser: async (req, res) => {
        try {
            const { userId, roomId } = req.body;
            await User_Room.destroy({
                where: { roomId, userId },
            });

            return res.sendStatus(StatusCodes.OK);
        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                title: error.name,
                message: error.message,
                directTo: 'back',
            })
        }
    }
}

module.exports = RoomController;
