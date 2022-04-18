const router = require('express').Router();
const roomController = require('../controllers/Room');

const { verifyToken } = require('../middleware/verify');
const upload = require('../config/fileUpload')('group');

router.route('/create')
    .post(verifyToken, roomController.createRoom);
    
router.route('/join')
    .post(verifyToken, roomController.joinRoom);

router.route('/update-info')
    .patch(verifyToken, roomController.updateInfo);

router.route('/update-avatar')
    .patch(verifyToken, upload.single('avatar'), roomController.updateAvatar);

router.route('/leave')
    .delete(verifyToken, roomController.leaveRoom);

router.route('/remove-user')
    .delete(verifyToken, roomController.removeUser);
    
router.route('/')
    .get(verifyToken, roomController.formEditRoom);

module.exports = router;
