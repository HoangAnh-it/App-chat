const router = require('express').Router();
const userController = require('../controllers/UserController');

router.route('/chat-area')
    .get(userController.home)

module.exports = router;
