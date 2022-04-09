const router = require('express').Router();
const siteController = require('../controllers/Site');
const auth = require('../middleware/auth');

const { verifyToken } = require('../middleware/verify');

router.route('/chat')
    .get(auth, siteController.chatBox)
    // .get(verifyToken, siteController.chatBox);

module.exports = router;
