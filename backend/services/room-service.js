const RoomModel = require('../models/room-model');
class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }

    async deleteRoom(roomId) {
        const trashRoom = await RoomModel.findOneAndDelete({ _id: roomId });
        return trashRoom;
    }

    async getAllRooms() {
        const rooms = await RoomModel.find()
            .populate('speakers')
            .populate('ownerId')
            .exec();
        return rooms;
    }

    async getRoom(roomId) {
        const room = await RoomModel.findOne({ _id: roomId });
        return room;
    }
}
module.exports = new RoomService();
