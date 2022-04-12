const { User, User_User, Op } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../error');

module.exports = function (io, socket) {
    return async ({ userId, friendId }) => {
        try {
            const friend = await User.findOne({ where: { userId: friendId } });
            
            if (!friend) {
                throw new NotFoundError('Not found', 'Cannot found friend');
            }

            const user_user = await User_User.findOne({
                where: {
                    [Op.or]: [
                        { userReqId: userId, userResId: friendId, status: 'friend' },
                        { userReqId: friendId, userResId: userId, status: 'friend' },
                    ]
                }
            });

            if (!user_user) {
                throw new NotFoundError('Not found', 'Cannot found associated users');
            }

            socket.join(user_user.id);
            socket.emit('info-partner', {
                type: 'private',
                id: user_user.id,
                avatar: friend.avatar,
                name: friend.name,
            });
        } catch (err) {
            console.log(err);
        }
    }
}
