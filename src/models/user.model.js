require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamp: true,
            hooks: {
                beforeSave: (instance, options) => {
                    const salt = bcryptjs.genSalt(10);
                    instance.password = bcryptjs.hash(instance.password, salt);
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

        return {
            accessToken,
        }
    }

    return User;
}
