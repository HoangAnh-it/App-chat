const Room = require('../models/Room.model');
const User = require('../models/User.model');

const RoomController = {
    createRoom: async (nameOfRoom, user) => {
        if (!nameOfRoom) return;
        const allRoomsOfUser = await user.getAllRooms();
        const existingRoom = allRoomsOfUser.some(room => {
            return room.name === nameOfRoom;
        });

        if (existingRoom) {
            throw new Error(`Room existed. Please create another one!`);
        }

        const newRoom = new Room({
            name: nameOfRoom,
            members: [user._id],
        });

        user.rooms.push(newRoom._id);
        await Promise.all([newRoom.save(), User.updateOne({ _id: user._id }, user)]);
    },
    
    joinRoom: async (roomId, user) => {
        const existingRoom = await Room.findOne({ _id: roomId });
        if (!existingRoom) {
            throw new Error('Room not found!');
        }

        existingRoom.members.push(user._id);
        user.rooms.push(existingRoom._id);
        await Promise.all([Room.updateOne({ _id: existingRoom._id }, existingRoom), User.updateOne({ _id: user._id }, user)]);
    },

    leaveRoom: (nameOfRoom, user) => {

    },
}

module.exports = RoomController;
