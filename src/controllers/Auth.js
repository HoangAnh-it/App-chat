const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');

const storageToken = require('../utils/storageToken');

const AuthController = {
    showLoginForm: (req, res) => {
        res.status(StatusCodes.OK).render('pages/login.ejs');
    },
    
    showRegisterForm: (req, res) => {
        res.status(StatusCodes.OK).render('pages/register.ejs');
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email,
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

        const { accessToken } = user.generateToken();
        storageToken(res, accessToken);

        return res.send({
            message: 'Login successfully',
            user,
        })
    },

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
            where: { email }
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
    }

}

module.exports = AuthController;
