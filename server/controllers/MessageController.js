
function chatting(server) {
    const io = require('socket.io')(server, {
        maxHttpBufferSize: 1e8,
    });
    io.on('connection', socket => {
        console.log('A user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('A user disconnected', socket.id);
            console.log('---------')
        });

        socket.on('send-message', data => {
            socket.broadcast.emit('new-message', data);
        })
    });
}

module.exports = chatting;
