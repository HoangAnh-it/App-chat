const jwt = require('jsonwebtoken');

async function isExpired(token, secret_token) {
    try {
        const payload = jwt.verify(token, secret_token);
        if (!payload) {
            throw new Error('Invalid token');
        }

        if (payload.exp < Date.now() / 1000) {
            console.log(payload, ' =>', Date.now());
            console.log('into <<<')
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong during checking expiration token');
    }
}

function storeToken(req, res, user) {
    const token = user.generateToken(); // both of access_token and refresh token
    req.session.token = token.refreshToken;
    req.session.isAuth = true;
    res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        signed: true,
    });
}

module.exports = { isExpired, storeToken };
