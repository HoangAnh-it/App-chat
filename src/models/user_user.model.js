module.exports = function (sequelize, DataTypes) {
    const User_User = sequelize.define('user_user', {
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
        { timestamp: true, }
    );

    return User_User;
}
