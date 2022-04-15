const router = require('express').Router();
const roomController = require('../controllers/Room');

router.route('/')
    .get(roomController.formEditRoom);

module.exports = router;
