module.exports = function auth(req, res, next) {
    if (!req.session?.auth?.isAuth) {
        return res.redirect('/api/v2/auth/login');
    }
    req.userId = req.session.auth.user._id;
    next();
}
