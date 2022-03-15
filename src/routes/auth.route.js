const router = require('express').Router();
const authController = require('../controllers/Auth');
const validate = require('../middleware/validator');
const { verify} = require('../middleware/verify');

router.route('/login')
    .get(authController.showLoginForm)
    .post(validate.validateLogin(), validate.handleError, authController.login)
    
router.route('/register')
    .get(authController.showRegisterForm)
    .post(validate.validateRegister(),validate.handleError, authController.register)
    
router.route('/logout')
    .get(authController.logout);

router.get('/test', (req, res) => {
    return res.render('pages/chat.ejs')
})

module.exports = router;
