const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
const { storeToken } = require('../helpers/token');
// const { CustomApiError, Unauthorized, NotFound } = require('../error');

const AuthController = {
    // [POST] api/auth/register
    register: async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(StatusCodes.CONFLICT).render('status', {
                notification: {
                    title: 'Duplicated email',
                    message: 'This email has already been used',
                }
            })
        }

        if (password !== confirmPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).render('status', {
                notification: {
                    title: 'Confirm password',
                    message: 'Password do not match',
                }
            })
        }

        const newUser = new User({ name, email, password});
        newUser.save()
            .then(() => {
                storeToken(req, res, newUser);
                res.redirect(`/api/user/chat-area?id=${newUser._id}`);
            })
            .catch(err => {
                return res.status(StatusCodes.BAD_REQUEST).render('status', {
                    notification: {
                        title: 'Error',
                        message: 'Something went wrong. Can not create account',
                    }
                })
            });

    },

    // [POST] api/auth/login
    login: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(StatusCodes.NOT_FOUND).render('status', {
                notification: {
                    title: 'Not Found',
                    message: 'Email address not found',
                }
            })
        }

        const isPasswordCorrected = await userExists.checkPassword(password);
        if (!isPasswordCorrected) {
            return res.status(StatusCodes.CONFLICT).render('status', {
                notification: {
                    title: 'Incorrect password',
                    message: 'Password does not match! Please try again!',
                }
            })
        } else {
            storeToken(req, res, userExists);            
            return res.redirect(`/api/user/chat-area`);
        }
    },

};

module.exports = AuthController;
