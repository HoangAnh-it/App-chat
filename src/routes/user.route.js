const router = require('express').Router();
const userController = require('../controllers/User');

router.route('/profile')
    .get(userController.getProfile)

router.route('/update-info')
    .patch(userController.update)

module.exports = router;
