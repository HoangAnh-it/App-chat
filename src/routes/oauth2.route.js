const router = require('express').Router();
const passport = require('passport');

router.route('/google')
    // redirect to apis google login
    .get(passport.authenticate('google', {scope: ['profile', 'email']}));

router.route('/google/callback')
    .get(passport.authenticate('google', {
        failureRedirect: '/api/v2/auth/login',
        successRedirect: '/api/v2/chat',
    }));

module.exports = router;
