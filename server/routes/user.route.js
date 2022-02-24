const router = require('express').Router();
const userController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/authenticateToken');

router.route('/chat-area')
    .get(userController.home)

router.route('/profile')
    .get(userController.profile)

router.route('/logout')
    .get( userController.logout)
    
module.exports = router;
