// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Hotel {
    address owner;
    enum RoomType { SINGLE, DOUBLE, SUITE }
    struct Room {
        uint price;
        RoomType typeOfRoom;
        uint roomNumber;
        bool occupied;
        uint start;
        uint end;
        uint owing;
    }
    // Room 1-15 are single rooms
    uint public numberOfSingleRooms;
    // Room 16-25 are double rooms
    uint public numberOfDoubleRooms;
    // Room 26-30 are suite rooms
    uint public numberOfSuiteRooms;
    Room[] public rooms;

    constructor () {
        owner = msg.sender;
        numberOfSingleRooms = 15;
        numberOfDoubleRooms = 10;
        numberOfSuiteRooms = 5;

        for (uint i=0; i<30; i++) {
            if (0 <= i && i < 15) {
                Room memory room = Room({
                    price: 20000000000000000,
                    typeOfRoom: RoomType.SINGLE,
                    roomNumber: i + 1,
                    occupied: false,
                    start: 0,
                    end: 0,
                    owing: 0
                });

                rooms.push(room);
            } else if (15 <= i && i < 25) {
                Room memory room = Room({
                    price: 40000000000000000,
                    typeOfRoom: RoomType.DOUBLE,
                    roomNumber: i + 1,
                    occupied: false,
                    start: 0,
                    end: 0,
                    owing: 0
                });

                rooms.push(room);
            } else {
                Room memory room = Room({
                    price: 60000000000000000,
                    typeOfRoom: RoomType.SUITE,
                    roomNumber: i + 1,
                    occupied: false,
                    start: 0,
                    end: 0,
                    owing: 0
                });

                rooms.push(room);
            }
        }
    }

    // @ return uint price returns price of room
    // @ return RoomType typeOfRoom returns type of room
    // @ return uint roomNumber returns room number
    // @ return bool occupied returns whether room is occupied
    function getRoom(uint index) external view returns (uint price, RoomType typeOfRoom, uint roomNumber, bool occupied, uint start, uint end, uint owing) {
        return (
            rooms[index].price,
            rooms[index].typeOfRoom,
            rooms[index].roomNumber,
            rooms[index].occupied,
            rooms[index].start,
            rooms[index].end,
            rooms[index].owing
        );
    }

   // @return uint roomNumber returns room number
   // @return uint roomkey returns room key
    function bookRoom(uint index) external returns (uint roomNumber, uint roomKey) {
        rooms[index].occupied = true;
        rooms[index].start = block.timestamp;

        roomNumber = index + 1;
        roomKey = uint(keccak256(abi.encodePacked(rooms[index].roomNumber)));

        return (roomNumber, roomKey);
    }

    function checkout(uint index) external {
        rooms[index].end = block.timestamp;

        uint numberOfDaysStayed = (rooms[index].end - rooms[index].start) / 1 days;
        uint total = rooms[index].price * numberOfDaysStayed;

        rooms[index].owing = total;
    }

    function pay(uint index) external payable {
        require(msg.value == rooms[index].owing, "You did not pay the correct amount");
        rooms[index].occupied = false;
        rooms[index].start = 0;
        rooms[index].end = 0;
        rooms[index].owing = 0;
    }

    function withdraw() public {
        require(owner == msg.sender, "You are not the owner");

        payable(owner).transfer(address(this).balance);
    }
}
