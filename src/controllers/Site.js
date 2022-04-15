const { User, Room } = require('../models');
const { StatusCodes } = require('http-status-codes');
const {
    NotFoundError,
} = require('../error');
require('dotenv').config();

const SiteController = {

    // [GET] /api/v2/chat
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
    },

    // [GET] /api/v2/all-users?page
    getAllUsers: async (req, res) => {
        try {
            const page = Number(req.query.page);
            const limit = Number(process.env.NoUsersPerPage);
            const maxPagesOneTime = Number(process.env.MaxPagesOneTime);
            const skip = (page - 1) * limit;

            const users = await User.findAll({
                limit: limit,
                offset: skip,
            });

            
            if (!users) {
                throw new NotFoundError('Not found', 'Cannot find users');
            }
            
            const noUsers = await User.count();
            const noPages = Math.ceil(noUsers / limit);
            const start = Math.floor(page / (maxPagesOneTime + 0.1) ) * maxPagesOneTime + 1;
            const end = start + maxPagesOneTime - 1 < noPages ? start + maxPagesOneTime - 1 : noPages;

            return res.status(StatusCodes.OK).render('pages/allUsers.ejs', {
                users,
                start,
                end,
                noPages,
                maxPagesOneTime,
            });
    
        } catch (error) {
            console.error(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/auth/login',
            });
        }
    },

    // [GET] /api/v2/error
    error: (req, res) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
            title: 'Error!',
            message: 'Cannot update profile. Something went wrong!',
            directTo: 'back',
        });
    },
}

module.exports = SiteController;
