require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        userId: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nickName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        address: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },

        password: {
            type: DataTypes.STRING,
        },

        avatar: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: process.env.DEFAULT_AVATAR,
        },

        loginType: {
            type: DataTypes.ENUM('local', 'google'),
            defaultValue: 'local',
        },
    },
        {
            timestamp: true,
            hooks: {
                beforeSave: async (instance, options) => {
                    if (instance.loginType === 'local') {
                        const salt = await bcryptjs.genSalt(10);
                        instance.password = await bcryptjs.hash(instance.password, salt);
                    };
                }
            }
        }
    
    );

    User.prototype.comparePassword = async function(password){
        const matches = await bcryptjs.compare(password, this.password);
        return matches;
    }

    User.prototype.generateToken = function () {
        const payload = {
            _id: this.userId,
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        return {
            accessToken: 'Bearer ' + accessToken,
            refreshToken: 'Bearer ' + refreshToken,
        }
    }
    
    return User;
}
