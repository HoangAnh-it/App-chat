const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');

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
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email,
            }
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).render('pages/status.ejs', {
                title: 'Not found',
                message: "Email not found",
                directTo: '/api/v2/auth/login',
            });
        }

        const passwordMatches = await user.comparePassword(password);
        if (!passwordMatches) {
            return res.status(StatusCodes.FORBIDDEN).render('pages/status.ejs', {
                title: 'Incorrect password',
                message: "Please enter your password correctly",
                directTo: '/api/v2/auth/login',
            });
        }

        const token = user.generateToken();
        storeToken(req, res, {
            userId: user.userId,
            token: token,
            typeLogin: user.typeLogin,
        });

        return res.redirect('/api/v2/chat');
    },



    // [POST] /api/v2/auth/register
    register: async (req, res) => {
        const { email, name, password, confirmPassword } = req.body;
        // check password and re-password
        if (password !== confirmPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).render('pages/status.ejs', {
                title: 'Not matches',
                message: 'Please enter your retype password correctly',
                directTo: '/api/v2/auth/register',
            })    
        }

        // check if existing user
        const existingUser = await User.findOne({
            where: {
                email,
                loginType: 'local',
            }
        });

        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).render('pages/status.ejs', {
                title: 'Duplicated',
                message: 'Email\'ve been already used',
                directTo: '/api/v2/auth/register',
            }) 
        }

        User.create({ email, name, password })
            .then(user => {
                return res.status(StatusCodes.OK).redirect('/api/v2/auth/login');
            })
            .catch(err => {
                console.error(err);
                return res.status(StatusCodes.BAD_REQUEST).render('pages/status.ejs', {
                    title: 'Not matches',
                    message: err.message,
                    directTo: '/api/v2/auth/register',
                })
            });
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
