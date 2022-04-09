const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const {
    NotFoundError,
    UnauthenticatedError,
    ConflictError,
    BadRequestError,
} = require('../error');

const storeToken = require('../utils/storageToken');

const AuthController = {
    // [GET] /api/v2/auth/login
    showLoginForm: (req, res) => {
        res.status(StatusCodes.OK).render('pages/login.ejs');
    },
    
    // [GET] /api/v2/auth/register
    showRegisterForm: (req, res) => {
        res.status(StatusCodes.OK).render('pages/register.ejs');
    },
    
    // [POST] /api/v2/auth/login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({
                where: {
                    email,
                }
            });

            if (!user) {
                throw new NotFoundError('Not found','Email not found');
            }

            const passwordMatches = await user.comparePassword(password);
            if (!passwordMatches) {
                throw new UnauthenticatedError('Not matches','Incorrect password. Please enter your password correctly');
            }

            const token = user.generateToken();
            storeToken(req, res, {
                userId: user.userId,
                token: token,
                typeLogin: user.typeLogin,
            });

            return res.redirect('/api/v2/chat');
        } catch (error) {
            console.log(error);
            return res.status(error.status).render('pages/status', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/auth/login',
            });
        }
    },



    // [POST] /api/v2/auth/register
    register: async (req, res) => {
        try {
            const { email, name, password, confirmPassword } = req.body;
            // check password and re-password
            if (password !== confirmPassword) {
                throw new UnauthenticatedError('Not matches', 'Please enter your retype password correctly');
            }

            // check if existing user
            const existingUser = await User.findOne({
                where: {
                    email,
                    loginType: 'local',
                }
            });

            if (existingUser) {
                throw new ConflictError('Duplicated', 'Email has been already used');
            }

            const newUser = User.create({ email, name, password });
            if (!newUser) {
                throw new BadRequestError('!!!', 'Cannot register. Something went wrong.');
            }
            return res.status(StatusCodes.OK).redirect('/api/v2/auth/login');

        } catch (error) {
            console.error(error);
            return res.status(error.status).render('pages/status.ejs', {
                title: error.name,
                message: error.message,
                directTo: '/api/v2/auth/register',
            })
        }
    },

    // [GET] api/v2/auth/logout
    logout: (req, res) => {
        try {
            req.session.destroy(() => { 
                res.redirect('/api/v2/auth/login');
            });
            res.clearCookie('access_token');
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('pages/status', {
                title: 'Error!',
                message: 'Can not log out. Something went wrong!',
                directTo: '/api/v2/chat',
            });
        }
    }

}

module.exports = AuthController;
