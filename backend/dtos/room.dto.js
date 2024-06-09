class RoomDto {
    id;
    topic;
    roomType;
    speakers;
    ownerId;
    createdAt;

    constructor(room) {
        this.id = room._id;
        this.topic = room.topic;
        this.roomType = room.roomType;
        this.totalPeople = room.totalPeople;
        this.ownerId = room.ownerId;
        this.speakers = room.speakers;
        this.createdAt = room.createdAt;
    }
}
module.exports = RoomDto;
