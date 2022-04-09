const { User, Room } = require('../models');

module.exports = function endChatting(io, socket) {
    /**
     * info : {
     *  type: String [room, private],
     *  id ,
     * }
     */
    return async(info) => {
        switch (info.type) {
            case 'room':
                const user = await User.findOne({ where: { userId: info.userId } });
                socket.to(`${info.roomId}`).emit('leave', user.name);
                socket.leave(`${info.roomId}`);
                break;
            
            case 'private':
                
                break;
            default: break;
        }
    }
}
