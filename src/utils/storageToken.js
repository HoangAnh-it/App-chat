module.exports = function storageToken(res, token) {
    res.cookie('access_token', token, {
        httpOnly: true,
        signed: true,
    });
}
