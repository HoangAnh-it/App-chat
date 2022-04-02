module.exports = function(io, socket) {
    return {
        error: (error) => {

        },

        handleCreate: (data) => {
            socket.emit('handle-create-room', data);
        },
        
        handleJoin: (data) => {

        }
    };
}