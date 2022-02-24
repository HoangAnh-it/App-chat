const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
// const { CustomApiError, Unauthorized, NotFound } = require('../error');

const AuthController = {
    // [POST] api/auth/register
    register: async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: 'This email has already been used',
            });
        }

        if (password !== confirmPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Password do not match',
            });
        }

        const newUser = new User({ name, email, password});
        newUser.save().then(() => {
            res.redirect(`/api/user/chat-area?id=${newUser._id}`);
        }).catch(console.err);

        // return res.status(StatusCodes.OK).json({
        //     user: {
        //         name,
        //     },
        // })
    },

    // [POST] api/auth/login
    login: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Email address not found',
            });
        }

        const isPasswordCorrected = userExists.checkPassword(password);
        if (!isPasswordCorrected) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: 'Password do not match',
            });
        } else {
            const token = userExists.generateToken(); // both of access_token and refresh token
            req.session.token = token.refreshToken;
            res.cookie('access_token', token.accessToken, {
                httpOnly: true,
                signed: true,
            });
            return res.redirect(`/api/user/chat-area?id=${userExists._id}`);
        }
    },

};

module.exports = AuthController;
