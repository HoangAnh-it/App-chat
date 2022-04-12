const { StatusCodes } = require('http-status-codes');
const { User, Room } = require('../models');

module.exports = function intoRoom(io, socket) {
    return async ({roomId, userId}) => {
        const room = await Room.findOne({ where: { roomId } });
        const user = await User.findOne({ where: { userId } });
        if (!room || !user) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error',
                message: 'Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
        socket.join(`room-${roomId}`);
        socket.to(`room-${roomId}`).emit('join', user.name);
        socket.emit('info-partner', {
            type: 'room',
            id: room.roomId,
            avatar: room.avatar,
            name: room.name,
        });
    }
}
