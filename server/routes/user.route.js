const router = require('express').Router();
const userController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/authorization');

router.route('/chat-area')
    .get(verifyToken, userController.home)

router.route('/profile/update-info/:id')
        .patch(userController.updateInfo)

router.route('/profile')
    .get( userController.profile)

router.route('/logout')
    .get( userController.logout)
    
module.exports = router;
