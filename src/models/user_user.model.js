const uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const User_User = sequelize.define('user_user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
        },

        userReqId: {
            type: DataTypes.INTEGER
        },

        userResId: {
            type: DataTypes.INTEGER
        },

        status: {
            type: DataTypes.ENUM('friend', 'pending'),
            defaultValue: 'pending',
        }
    },
        {
            timestamp: true,
        }
    );

    return User_User;
}
