// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Hotel {
    enum RoomType { SINGLE, DOUBLE, SUITE }
    struct Room {
        uint price;
        RoomType typeOfRoom;
        uint roomNumber;
        bool occupied;
    }
    // Room 1-15 are single rooms
    uint public numberOfSingleRooms;
    // Room 16-25 are double rooms
    uint public numberOfDoubleRooms;
    // Room 26-30 are suite rooms
    uint public numberOfSuiteRooms;
    Room[] public rooms;

    constructor () {
        numberOfSingleRooms = 15;
        numberOfDoubleRooms = 10;
        numberOfSuiteRooms = 5;

        for (uint i=0; i<30; i++) {
            if (0 <= i && i < 15) {
                Room memory room = Room({
                    price: 100,
                    typeOfRoom: RoomType.SINGLE,
                    roomNumber: i + 1,
                    occupied: false
                });

                rooms.push(room);
            } else if (15 <= i && i < 25) {
                Room memory room = Room({
                    price: 200,
                    typeOfRoom: RoomType.DOUBLE,
                    roomNumber: i + 1,
                    occupied: false
                });

                rooms.push(room);
            } else {
                Room memory room = Room({
                    price: 300,
                    typeOfRoom: RoomType.SUITE,
                    roomNumber: i + 1,
                    occupied: false
                });

                rooms.push(room);
            }
        }
    }

    // @ return uint price returns price of room
    // @ return RoomType typeOfRoom returns type of room
    // @ return uint roomNumber returns room number
    // @ return bool occupied returns whether room is occupied
    function getRoom(uint index) external view returns (uint price, RoomType typeOfRoom, uint roomNumber, bool occupied) {
        return (
            rooms[index].price,
            rooms[index].typeOfRoom,
            rooms[index].roomNumber,
            rooms[index].occupied
        );
    }

   // @return uint roomNumber returns room number
   // @return uint roomkey returns room key
    function buyRoom() external returns (uint roomNumber, uint roomKey) {}
}
