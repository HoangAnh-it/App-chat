const jwt = require('jsonwebtoken');
const { generateTokenExpired} = require('../utils/token');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const accessToken = req.signedCookies.access_token?.split(' ')[1];
    if (!accessToken) {
        return res.redirect('/api/v2/auth/login');
    }
    const { _id: userId, exp } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (exp * 1000 <= Date.now()) {
        console.log('>>>>>>>>>>         TOKEN WAS EXPIRED       <<<<<<<<');  
        generateTokenExpired(req, res);
    }
    req.userId = userId;
    next();
}

module.exports = {
    verifyToken,
}
