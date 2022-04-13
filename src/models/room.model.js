require('dotenv').config();
const uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const Room = sequelize.define('room', {
        roomId: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        avatar: {
            type: DataTypes.STRING,
            defaultValue: process.env.DEFAULT_AVATAR_GROUP,
        },

        name: {
            type: DataTypes.STRING,
            required: true,
        },

        admin: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            onDelete: 'cascade',
        },

        maximum_users: {
            type: DataTypes.INTEGER,
        }
    },
        {
            timestamp: true,
        });

    return Room;
}