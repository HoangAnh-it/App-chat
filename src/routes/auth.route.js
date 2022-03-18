const router = require('express').Router();
const authController = require('../controllers/Auth');
const validate = require('../middleware/validator');

router.route('/login')
    .get(authController.showLoginForm)
    .post(validate.validateLogin(), validate.handleError, authController.login);

router.route('/register')
    .get(authController.showRegisterForm)
    .post(validate.validateRegister(), validate.handleError, authController.register);

router.route('/logout')
    .get(authController.logout);

module.exports = router;
