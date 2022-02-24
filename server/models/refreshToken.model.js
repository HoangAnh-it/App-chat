const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define('refreshToken', {
        token: { type: Sequelize.STRING },
        expireDate: { type: Sequelize.DATE },
    });

    RefreshToken.createToken = async function (user) {
        const expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + process.env.REFRESH_TOKEN_LIFE);
        const _token = uuid4();
        const refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });
        return refreshToken.token;
    }

    RefreshToken.verifyExpiration = (token) => {
        return token.expireDate.getTime() < new Date().getTime();
    }

    return RefreshToken;
}