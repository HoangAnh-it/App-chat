const { User, Op } = require('../models');

module.exports = function search(io, socket) {
    return async (keyword) => {
        const users = await User.findAll({
            raw: true,
            where: {
                name: {
                    [Op.like]: `%${keyword}%`,
                }
            }
        });

        const results = users.map(user => {
            return {
                userAvatar: user.avatar,
                userId: user.userId,
                userName: user.name,
            }
        });

        socket.emit('results of searching', results);
    }
}
