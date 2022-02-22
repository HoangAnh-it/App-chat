const mongoose = require('mongoose');

function connectMongoDb(URL) {
    mongoose.connect(URL)
        .then(() => {
            console.log('Connected to mongooseDb');
        }).catch(console.err);
} 

module.exports = {
    connectMongoDb,
}