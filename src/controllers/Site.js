const { User, Room } = require('../models');
const { StatusCodes } = require('http-status-codes');
const {
    NotFoundError,
} = require('../error');

const SiteController = {
    chatBox: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findOne({
                where: { userId },
                include: [
                    Room,
                    {
                        model: User,
                        as: 'userRes',
                        through: {
                            attributes: ['status'],
                        }
                    },
                    {
                        model: User,
                        as: 'userReq',
                        through: {
                            attributes: ['status'],
                        }
                    },
                ]
            });

            if (!user) {
                throw new NotFoundError('Not found', 'Cannot find user');
            }

            // get rid of password fields from user
            const { password, ...info } = user.dataValues;
            // get friends
            let friends = [];
            if (user.userReq.length > 0) {
                friends.push(...(user.userReq.filter(entity => entity.user_user.status === 'friend')));
            }
                
            if (user.userRes.length > 0) {
                friends.push(...(user.userRes.filter(entity => entity.user_user.status === 'friend')));
            }
            // find friends and get rid of password, user_user fields
            friends = friends.map(friend => {
                const { password,user_user, ...info } = friend.dataValues;
                return info;
            });

            return res.status(StatusCodes.OK).render('pages/chat.ejs', {
                user: info,
                userId: userId,
                friends: friends,
                rooms: user.rooms,
            });

        } catch (error) {
            console.error(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/auth/login',
            });
        }
    }
}

module.exports = SiteController;
