module.exports = function (sequelize, DataTypes) {
    const User_Room = sequelize.define('user_room', {
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'userId',
            },
            onDelete: 'cascade',
        },
        
        roomId: {
            type: DataTypes.UUID,
            references: {
                model: 'rooms',
                key: 'roomId',
            },
            onDelete: 'cascade',
        }
    },
        { timestamp: true }
    );

    return User_Room;
}
