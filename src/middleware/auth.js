module.exports = function auth(req, res, next) {
    console.log(req.session);
    if (req.session?.auth?.isAuth) {
        req.userId = req.session.auth.user._id;
        return next();
    } else if (req.session?.passport?.user?.isAuth) {
        req.userId = req.session.passport.user._id;
        return next();
    }
    
    return res.redirect('/api/v2/auth/login');
}
