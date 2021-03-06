const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateTokenExpired(req, res) {
    const accessToken = req.signedCookies.access_token;
    if (!accessToken) {
        const refreshToken = req.session?.auth?.refreshToken;
        if (refreshToken) {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
            const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
            req.session.auth.refreshToken = newRefreshToken;
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                secure: false,
                signed: true,
            });
        }
    }
}

module.exports = {
    generateTokenExpired,
}