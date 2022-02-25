function isAuth(req, res, next) {
    console.log(req.session?.isAuth)
    if (req.session?.isAuth) {
        return next();
    }
    return res.redirect('/api/login');
}

module.exports = { isAuth };