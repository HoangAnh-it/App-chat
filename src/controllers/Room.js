const { Room, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../error');

const RoomController = {

    // [GET] /api/v2/room/edit?id
    formEditRoom: async(req, res) => {
        try {
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

            const adminId = room.admin;
            const admin = await User.findOne({ where: { userId: adminId } });
            if (!admin) {
                throw new NotFoundError('Not found', 'Cannot find admin of this room.');
            }

            return res.status(StatusCodes.OK).render('pages/editRoom.ejs', {
                room,
                admin: {
                    id: admin.userId,
                    name: admin.name,
                    avatar: admin.avatar,
                },
                members: room.users,
            });
            
        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
    },

    // [POST] /api/v2/room/edit?id
    editRoom: async (req, res) => {

    },
}

module.exports = RoomController;
