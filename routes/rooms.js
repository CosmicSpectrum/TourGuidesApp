const express = require('express');
const authenticateMiddleware = require('../middlewares/auth');
const Rooms = require('../models/rooms');
const codeGenerator = require('../libs/codeGenerator');
const router = express.Router();

router.use(authenticateMiddleware);

router.post('/createRoom', (req,res)=>{
    try{
        const {tourDescription} = req.body;
        const {fullname, _id} = req.user;
        const roomCode = codeGenerator(4);

        const Room = new Rooms({
            roomCreator: _id,
            roomCode: roomCode,
            guideName: fullname,
            ...(tourDescription) && {tourDescription: tourDescription}
        })
        
        Room.save(err=>{
            if(err)
                throw err;

            return res.status(200).json({status: true});
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
})

router.delete('/deleteRoom', (req,res)=>{
    try{
        const {roomId} = req.body;
        Rooms.deleteOne({_id: roomId}, (err)=>{
            if(err) throw err;
            
            return res.status(200).json({status: true});
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }

})

router.get('/getRoomsList', (req,res)=>{
    try{
        Rooms.find({},(err, records)=>{
            if(err) throw err;

            return res.status(200).json({rooms: records});
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("somthing went wrong");
    }
})

router.post('/validateRoomCode', (req,res)=>{
    try{
        const {roomId, userCode} = req.body;

        Rooms.findById(roomId, (err, room)=>{
            if(err) throw err;

            if(room){
                if(room.roomCode == userCode){
                    return res.status(200).json({status: true});
                }else{
                    return res.status(401).json({status: false});
                }
            }else{
                return res.status(404).send("invalid room id");
            }
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }
})

module.exports = router;