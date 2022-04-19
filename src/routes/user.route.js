const router = require('express').Router();
const userController = require('../controllers/User');

const { verifyToken } = require('../middleware/verify');
const { authUser } = require('../middleware/authUser');
const validate = require('../middleware/validator');
const upload = require('../config/fileUpload')('user');

router.route('/profile')
    .get(verifyToken, authUser, userController.getProfile);

router.route('/update-info')
    .patch(validate.validateUpdateInfo(), validate.handleError, verifyToken, userController.updateInfo);

router.route('/update-avatar')
    .patch(verifyToken, upload.single('avatar'), userController.updateAvatar);

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
        
router.route('/send-email')
    .post(verifyToken, userController.sendEmail);

module.exports = router;
