const { User } = require('../models');

module.exports = function sendMessage(io, socket) {
    return async (data) => {
        const sender = await User.findOne({ where: { userId: data.senderId } });
        const partnerId = data.partnerId;

        console.log(`${data.type}-${partnerId}`);
        io.in(`${data.type}-${partnerId}`).emit('receive-message', {
            senderId: sender.userId,
            senderName: sender.name,
            senderAvatar: sender.avatar,
            message: data.message,
        });
    }
}
