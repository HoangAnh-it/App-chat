const siteController = require('../controllers/SiteController');
const router = require('express').Router();

router.get('/register', siteController.register);
router.get('/login', siteController.login);

module.exports = router;