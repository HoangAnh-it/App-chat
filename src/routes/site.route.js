const router = require('express').Router();
const siteController = require('../controllers/Site');
const auth = require('../middleware/auth');

const { verifyToken } = require('../middleware/verify');

router.route('/chat')
    .get(auth, siteController.chatBox)

router.route('/all-users')
    .get(verifyToken, siteController.getAllUsers);

router.route('/search-user')
    .get(siteController.searchUsers);

module.exports = router;
