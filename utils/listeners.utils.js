const Rooms = require('../models/rooms');

module.exports = class ListenersUtils{

    /**
     * add user to listeners array of a room in order to call it if needed
     * @param {String} userId the user peer server id
     * @param {String} roomCode the room code to add the user to
     * @returns operation status
     */
    static addNewListener(userId, roomCode){
        return new Promise((resolve,reject)=>{
            Rooms.findOne({roomCode}, (err, room)=>{
                if(err) reject(err);

                if(room){
                    if(!room.activeUsers.includes(userId)){
                        room.activeUsers.push(userId);
                        room.save();
                        resolve(true);
                    }
                }
                resolve(false);
            })
        })
    }

    /**
     * remove the leaving user from the active listeners array in a room
     * @param {String} userId the user peer id
     * @param {String} roomCode the room code
     * @returns operation status
     */
    static removeListener(userId, roomCode){
        return new Promise((resolve, reject)=>{
            Rooms.findOne({roomCode}, (err,room)=>{
                if(err) reject(err);

                if(room){
                    const indexToRemove = room.activeUsers.findIndex(currId => currId === userId);
                    room.activeUsers.splice(indexToRemove, 1);
                    room.save();
                    resolve(true);
                }
                resolve(false);
            })
        })
    }
}