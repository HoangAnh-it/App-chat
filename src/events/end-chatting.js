module.exports = function endChatting(io, socket) {
    /**
     * info : {
     *  type: String [room, private],
     *  id ,
     * }
     */
    return (info) => {
        switch (info.type) {
            case 'room':
                console.log('you have left room', info.id);
                socket.leave(`${info.id}`);
                break;
            
            case 'private':
                
                break;
            default: break;
        }
    }
}
