module.exports = function socket(io) {
    io.on('connection', socket => {
        console.log('An user connected', socket.id);
      
        socket.on('open-room', require('../events/open-room')(io, socket));
        socket.on('end-chatting', require('../events/end-chatting')(io, socket));
        socket.on('send-message', require('../events/send-message')(io, socket));
        socket.on('search-friends', require('../events/search')(io, socket));
        socket.on('private', require('../events/private')(io, socket));
    })
}
