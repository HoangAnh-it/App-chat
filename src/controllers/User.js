const { StatusCodes } = require('http-status-codes');
const { User, Room, User_Room, User_User, Op } = require('../models');
const { trimObj } = require('../utils/object');
const {
    CustomError,
    NotFoundError,
    ConflictError,
    BadRequestError,
    UnauthenticatedError,
} = require('../error');

const UserController = {
    // [GET] /api/v2/user/profile?userId
    getProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const otherId = req.query.id;
            const isYourProfile = userId === otherId;
            
            const user = await User.findOne({ where: { userId } });

            const payload = {};
            let profileUser = undefined;
            if (!isYourProfile) {
                const anotherUser = await User.findOne({ where: { userId: otherId } });

                const associatedUser = await User_User.findOne({
                    where: {
                        [Op.or]: [
                            {
                                userReqId: userId,
                                userResId: otherId,
                            },
                            {
                                userReqId: otherId,
                                userResId: userId,
                            }
                        ]
                    }
                });

                if (associatedUser) {
                    payload.userRole = associatedUser.userReqId === userId ? 'userReq' : 'userRes';    
                }
                profileUser = anotherUser;
                payload.status = associatedUser ? associatedUser.status : 'none';

            } else {
                profileUser = user;
            }

            payload.profile = {
                id: profileUser.userId,
                avatar: profileUser.avatar,
                name: profileUser.name,
                email: profileUser.email,
                nickName: profileUser.nickName,
                address: profileUser.address,
            };
            payload.userId = userId;
            payload.isYourProfile = isYourProfile;
            return res.status(StatusCodes.OK).render('pages/profile.ejs', payload);

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Cannot find profile. Something went wrong!',
                directTo: 'back',
            });
        }
    },

    // [PATCH] /api/v2/user/update-info?userId
    updateInfo: async(req, res) => {
        try {
            const newValue = trimObj(req.body);
            // check if new email has already been used.
            if ('email' in newValue) {
                const existingUser = await User.findOne({ where: { email: newValue.email } });
                if (existingUser) {
                    throw new ConflictError('Duplicated', 'This email has already been used');
                }
            }

            const userId = req.userId;
            await User.update(newValue, { where: { userId } });
            return res.redirect(`/api/v2/user/profile?id=${userId}`)
        } catch (error) {
            console.error(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
    },

    // [PATCH] /api/v2/user/update-avatar
    updateAvatar: async (req, res) => {
        console.log(req.body);
        console.log(req.file);
        try {
            const userId = req.userId;
            const newAvatar = `/images/upload/user/${req.file.filename}`;
            await User.update({
                avatar: newAvatar,
            },
                {
                    where: { userId }
                });
        
            return res.status(StatusCodes.OK).redirect(`/api/v2/user/profile?id=${userId}`);
            
        } catch (error) {
            console.error(error);
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).render('/pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            });
        }
    },

    // [POST] /api/v2/user/send-friend-request
    sendFriendRequest: async (req, res) => {
        try {
            const userReqId = req.userId;
            const userResId = req.body.otherId;
            const userReq = await User.findOne({ where: { userId: userReqId } });
            const userRes = await User.findOne({ where: { userId: userResId } });
            if (!userReq || !userRes) {
            
                throw new BadRequestError('ERROR', 'Cannot send request. Something went wrong!');
            }
        
            userReq.addUserRes(userRes)
            return res.redirect(`/api/v2/user/profile?id=${userReqId}`);
        
        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `back`,
            });
        }
    },

    // [POST]  /api/v2/user/cancel-friend-request
    cancelOrDeleteFriendRequest: async (req, res) => {
        try {
            const userId = req.userId;
            const otherId = req.body.otherId;
            await User_User.destroy({
                where: {
                    [Op.or]: [
                        {
                            userReqId: userId,
                            userResId: otherId,
                            status: 'pending',
                        },
                        {
                            userReqId: otherId,
                            userResId: userId,
                            status: 'pending',
                        }
                    ]
                }
            });
            
            return res.redirect(`/api/v2/user/profile?id=${userId}`);

        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `back`,
            });
        }
    },

    // [POST]  /api/v2/user/confirm-friend-request
    confirmFriendRequest: async (req, res) => {
            const userId = req.userId;
            const otherId = req.body.otherId;
        User_User.update(
            { status: 'friend' },
            {
                where: {
                    userReqId: otherId,
                    userResId: userId,
                    status: 'pending',
                }
            }
        ).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${otherId}`);
        }).catch(error => {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `back`,
            });
        });
    },
    
    unfriend: async (req, res) => {
        const userId = req.userId;
        const otherId = req.body.otherId;
        User_User.destroy({
            where: {
                [Op.or]: [
                    {
                        userReqId: userId,
                        userResId: otherId,
                        status: 'friend',
                    },
                    {
                        userReqId: otherId,
                        userResId: userId,
                        status: 'friend',
                    }
                ]
            }
        }).then(() => {
            return res.redirect(`/api/v2/user/profile?id=${otherId}`);
        }).catch(error => {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: `back`,
            });
        })
    },

    // [PATCH] /api/v2/user/change-password
    changePassword: async (req, res) => {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword, confirmNewPassword } = trimObj(req.body);
            const user = await User.findOne({ where: { userId } });
            if (!user) {
                throw new NotFoundError('Not found', 'Cannot found user');
            }

            const passwordMatches = await user.comparePassword(currentPassword);
            if (!passwordMatches) {
                throw new UnauthenticatedError('Not matches', 'Incorrect password. Please enter your password correctly');
            }
            
            if (newPassword !== confirmNewPassword) {
                throw new UnauthenticatedError('Not matches', 'Please enter your retype password correctly');
            }

            await user.update({ password: newPassword });
            return res.redirect(`/api/v2/user/profile?id=${userId}`);
            
        } catch (error) {
            console.error(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            })
        }
    },

    // [DELETE] /api/v2/user/delete-account
    deleteAccount: async (req, res) => {
        try {
            const { email, password } = trimObj(req.body);
            const userId = req.userId;
            const user = await User.findOne({ where: { userId } });
            if (!user) {
                throw new NotFoundError('Not found', 'Cannot find user');
            }

            if (email !== user.email) {
                throw new UnauthenticatedError('Not matches', 'Incorrect email. Please enter your email correctly');
            }

            const passwordMatches = await user.comparePassword(password);
            if (!passwordMatches) {
                throw new UnauthenticatedError('Not matches', 'Incorrect password. Please enter your password correctly');
            }

            User.destroy({ where: { userId } })
                .then(() => {
                    return res.redirect('/api/v2/auth/login');
                });

        } catch (error) {
            console.error(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: 'back',
            })
        }
    }
}

module.exports = UserController;
