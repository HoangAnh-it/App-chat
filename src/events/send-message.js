const { User } = require('../models');

module.exports = function sendMessage(io, socket) {
    return async (data) => {
        switch (data.type) {
            case 'room':
                const roomId = data.partnerId;
                const sender = await User.findOne({ where: { userId: data.senderId } });
                // send to all members in room ( include sender)
                io.in(`${roomId}`).emit('receive-message', {
                    senderId: sender.userId,
                    senderAvatar: sender.avatar,
                    message: data.message,
                });
                break;
            
            case 'private':

                break;
            
            default: break;
        }
    }
}
