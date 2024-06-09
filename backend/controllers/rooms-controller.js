const RoomDto = require('../dtos/room.dto');
const roomService = require('../services/room-service');

class RoomsController {
    async create(req, res) {
        // room
        const { topic, roomType } = req.body;

        if (!topic || !roomType) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id,
        });

        return res.json(new RoomDto(room));
    }

    async delete(req, res) {
        const roomId = req.params.roomId;
        const trashRoom = await roomService.deleteRoom(roomId);
        console.log(trashRoom);
        return res.json(trashRoom);
    }

    async index(req, res) {
        const rooms = await roomService.getAllRooms();
        const allRooms = rooms.map((room) => new RoomDto(room));
        return res.json(allRooms);
    }

    async show(req, res) {
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }
}

module.exports = new RoomsController();
