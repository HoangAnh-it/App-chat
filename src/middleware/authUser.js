function authUser(req, res, next) {
    const otherId = req.query.id;
    const userId = req.userId;
    req.isYourProfile = otherId == userId;
    req.otherId = otherId;
    next();
}

module.exports = {
    authUser,
}
