module.exports = function storeToken(req, res, userId, token) {
    res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        signed: true,
    });

    req.session.auth = {
        refreshToken: token.refreshToken,
        isAuth: true,
        user: {
            _id: userId,
        }
    }
}
