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

db.User = require('./user.model')(sequelize, DataTypes);

sequelize.authenticate()
    .then(() => console.log('>> Connection has been established successfully '))
    .catch(err => {
        console.error('>> Unable to connect to database', err);
    });

sequelize.sync({ force: false })
    .then(() => { console.log(`>> Mysql is syncing...\n>> Connect to Mysql successfully!`) })
    .catch(err => {
        console.error('>> Can not sync', err);
    });
    
module.exports = db;
