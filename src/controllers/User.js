const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
const { trimObj } = require('../utils/object');


const UserController = {
    getProfile: async (req, res) => {
        try {
            const userId = req.query.id;
            const user = await User.findOne({
                where: { userId }
            });

            if (!user) {
                throw new Error();
            }

            return res.status(StatusCodes.OK).render('pages/profile.ejs', {
                user: {
                    userId: user.userId,
                    avatar: user.avatar,
                    name: user.name,
                    email: user.email,
                    nickName: user.nickName,
                    address: user.address,
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot find profile. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
    },

    update: (req, res) => {
        const newValue = trimObj(req.body);
        const userId = req.query.id;
        console.log(newValue);
        console.log(userId);
        User.update(newValue, {
            where: { userId, }
        }).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${userId}`)
        }).catch(error => {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot update profile. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        });
    }
}

module.exports = UserController;
