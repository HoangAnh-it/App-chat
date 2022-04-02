module.exports = function (sequelize, DataTypes) {
    const User_User = sequelize.define('user_user', {
        userId: {
            type: DataTypes.INTEGER
        },

        friendId: {
            type: DataTypes.INTEGER
        }
    },
        { timestamp: true, }
    );

    return User_User;
}
