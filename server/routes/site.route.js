const siteController = require('../controllers/SiteController');
const router = require('express').Router();
const { isAuth } = require('../middleware/authentication');


router.route('/register')
    .get(siteController.register)

router.route('/login')
    .get(siteController.login)

router.route('/')
    .get(isAuth, (req, res) => {
        return res.redirect('/api/user/chat-area')
    } )

module.exports = router;