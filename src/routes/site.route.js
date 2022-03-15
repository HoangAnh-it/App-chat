const router = require('express').Router();
const siteController = require('../controllers/Site');
const auth = require('../middleware/auth');

router.route('/chat')
    .get(auth, siteController.chatBox);

module.exports = router;
