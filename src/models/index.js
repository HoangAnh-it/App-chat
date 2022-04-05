require('dotenv').config();
const { DataTypes, Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        port: process.env.MYSQL_POST,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.User = require('./user.model')(sequelize, DataTypes);
db.Room = require('./room.model')(sequelize, DataTypes);
db.User_Room = require('./user_room.model')(sequelize, DataTypes);
db.User_User = require('./user_user.model')(sequelize, DataTypes);

/** ASSOCIATION MODELS */
// user - room
db.User.belongsToMany(db.Room, { through: db.User_Room, foreignKey: 'userId' });
db.Room.belongsToMany(db.User, { through: db.User_Room, foreignKey: 'roomId' });

// user - user
db.User.belongsToMany(db.User, {as: 'user', through: db.User_User, foreignKey: 'userId', otherKey: 'friendId' });
db.User.belongsToMany(db.User, { as: 'friend', through: db.User_User, foreignKey: 'friendId', otherKey: 'userId' });

// test connect
sequelize.authenticate()
    .then(() => console.log('>> Connection has been established successfully '))
    .catch(err => {
        console.error('>> Unable to connect to database', err);
    });

// sync
sequelize.sync({ force: false })
    .then(() => { console.log(`>> Mysql is syncing...\n>> Connect to Mysql successfully!`) })
    .catch(err => {
        console.error('>> Can not sync', err);
    });
    
module.exports = db;
