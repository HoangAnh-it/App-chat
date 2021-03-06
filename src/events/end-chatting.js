const { User, Room } = require('../models');

module.exports = function endChatting(io, socket) {
    /**
     * info : {
     *  type: String [room, private],
     *  id ,
     * }
     */
    return async (info) => {
        switch (info.type) {
            case 'room':
                const user = await User.findOne({ where: { userId: info.userId } });
                socket.to(`room-${info.partnerId}`).emit('leave', user.name);
                socket.leave(`room-${info.partnerId}`);
                break;
            
            case 'private':
                socket.leave(`private-${info.partnerId}`);
                break;
            default: break;
        }
    }
}
