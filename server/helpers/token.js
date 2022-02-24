const jwt = require('jsonwebtoken');

async function isExpired(token, secret_token) {
    try {
        const payload = jwt.verify(token, secret_token);
        console.log('payload => ',payload);
        if (!payload) {
            throw new Error('Invalid token');
        }
        console.log(Date.now());

        if (payload.exp < Date.now()) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong during checking expiration token');
    }
}

module.exports = { isExpired };
