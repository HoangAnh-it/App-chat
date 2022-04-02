const roomHandle = require('../roomHandle');

function socket(io) {
    io.on('connection', socket => {
        console.log('An user connected', socket.id);
        
    })
}

module.exports = socket;