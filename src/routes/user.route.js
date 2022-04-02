const router = require('express').Router();
const userController = require('../controllers/User');

const { verifyToken } = require('../middleware/verify');

router.route('/profile')
    .get(userController.getProfile)

router.route('/update-info')
    .patch(verifyToken, userController.update)

router.route('/create-room')
    .post(verifyToken, userController.createRoom);

router.route('/join-room')
    .post(verifyToken, userController.joinRoom);

router.route('/leave-room')
    .get(verifyToken, userController.leaveRoom);

module.exports = router;
