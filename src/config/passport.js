const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config();

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v2/oauth2/google/callback',

    }, async (accessToken, refreshToken, profile, done) => {
        let newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            loginType: profile.provider,
        };

        try {
            const existingUser = await User.findOne({ where: { email: newUser.email } })
            if (existingUser) {
                return done(null, existingUser);
            } else {
                newUser = await User.create(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }));

    // save into session
    passport.serializeUser((user, done) => {
        done(null, {
            _id: user.userId,
            isAuth: true,
        });
    });
    
    // get from session
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}
