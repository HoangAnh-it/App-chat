const siteController = require('../controllers/SiteController');
const router = require('express').Router();

router.route('/register')
    .get(siteController.register)

router.route('/login')
    .get(siteController.login)

module.exports = router;