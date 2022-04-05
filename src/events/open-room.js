const res = require('express/lib/response');
const { StatusCodes } = require('http-status-codes');
const { User, Room } = require('../models');

module.exports = function intoRoom(io, socket) {
    return async (roomId) => {
        console.log('>>> You are into room: ', roomId);
        socket.join(`${roomId}`);
        const room = await Room.findOne({ where: { roomId } });
        if (!room) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error',
                message: 'Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
        socket.emit('info-partner', {
            type: 'room',
            id: room.roomId,
            avatar: room.avatar,
            name: room.name,
        });
    }
}
