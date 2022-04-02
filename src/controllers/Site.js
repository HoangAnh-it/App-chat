const {StatusCodes} = require('http-status-codes');
const { User, Room } = require('../models');

const SiteController = {
    chatBox: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findOne({
                where: { userId },
                include: [Room]
            });

            if (!user) {
                throw new Error('Can not find user!');
            }

            return res.render('pages/chat.ejs', {
                user,
                friends: [],
                rooms: user.rooms,
            });

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status.ejs', {
                title: 'Error',
                message: error.message + 'Something went wrong!',
                directTo: '/api/v2/auth/login',
            });
        };
    }
}

module.exports = SiteController;
