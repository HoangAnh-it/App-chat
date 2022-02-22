const userController = require('../controllers/UserController');
const router = require('express').Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;
