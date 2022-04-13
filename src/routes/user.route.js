const router = require('express').Router();
const userController = require('../controllers/User');

const { verifyToken } = require('../middleware/verify');
const { authUser } = require('../middleware/authUser');
const validate = require('../middleware/validator');

router.route('/profile')
    .get(verifyToken, authUser, userController.getProfile);

router.route('/update-info')
    .patch(verifyToken, userController.update)

router.route('/create-room')
    .post(verifyToken, userController.createRoom);

router.route('/join-room')
    .post(verifyToken, userController.joinRoom);

router.route('/leave-room')
    .get(verifyToken, userController.leaveRoom);

router.route('/send-friend-request')
    .post(verifyToken, userController.sendFriendRequest);

router.route('/cancel-friend-request')
    .post(verifyToken, userController.cancelOrDeleteFriendRequest);
        
router.route('/confirm-friend-request')
    .post(verifyToken, userController.confirmFriendRequest);

router.route('/delete-friend-request')
    .post(verifyToken, userController.cancelOrDeleteFriendRequest);

router.route('/unfriend')
    .post(verifyToken, userController.unfriend);

router.route('/change-password')
    .patch(validate.validateChangePassword(), validate.handleError, verifyToken, userController.changePassword);

router.route('/delete-account')
        .delete(validate.validateDeleteAccount(), validate.handleError, verifyToken, userController.deleteAccount);

module.exports = router;
