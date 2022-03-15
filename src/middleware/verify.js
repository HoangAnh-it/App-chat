const jwt = require('jsonwebtoken');
const { isTokenExpired, generateTokenExpired} = require('../utils/token');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const accessToken = req.signedCookies.accessToken?.split(' ')[1];

    if (!accessToken) {
        return res.redirect('/api/v2/auth/login');
    }

    if (isTokenExpired(accessToken)) {
        generateTokenExpired(req, res);
    }

    const { _id: userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = userId;
    next();
}

module.exports = {
    verifyToken,
}
