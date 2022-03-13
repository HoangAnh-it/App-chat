const { StatusCodes } = require('http-status-codes');
const { check, validationResult } = require('express-validator');

const validate = {

    handleError: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).render('pages/status.ejs', {
                title: 'ERRORS',
                message: errors.array().map(err => err.msg).join(' - '),
                directTo:'',
            })
        }

        next();
    },

    validateLogin: () => {
        return [
            check('email', 'Invalid email').isEmail(),
            check('email', 'Email could not be empty').not().isEmpty(),
            check('password', 'Password could not be empty').not().isEmpty(),
            check('password', 'Password must be more than 6 digits').isLength({ min: 6 }),
        ];
    },
    
    validateRegister: () => {
        return [
            check('email', 'Invalid email').isEmail(),
            check('email', 'Email could not be empty').not().isEmpty(),
            check('name', 'Name could not be empty').not().isEmpty(),
            check('password', 'Password could not be empty').not().isEmpty(),
            check('password', 'Password must be more than 6 digits').isLength({ min: 6 }),
            check('confirmPassword', 'Re-password could not be empty').not().isEmpty(),
            check('confirmPassword', 'Re-password must be more than 6 digits').isLength({ min: 6 }),
        ]
    }
};

module.exports = validate;
