module.exports = function (sequelize, DataTypes) {
    const User_Room = sequelize.define('user_room', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'userId',
            }
        },
        
        roomId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'rooms',
                key: 'roomId',
            }
        }
    },
        { timestamp: true }
    );

    return User_Room;
}
