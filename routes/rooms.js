const express = require('express');
const authenticateMiddleware = require('../middlewares/auth');
const Rooms = require('../models/rooms');
const codeGenerator = require('../libs/codeGenerator');
const router = express.Router();
const {Types} = require('mongoose')

router.post('/createRoom',authenticateMiddleware ,(req,res)=>{
    try{
        const {tourDescription, guidePack} = req.body;
        const {fullname, _id} = req.user;
        const roomCode = codeGenerator(4);

        const Room = new Rooms({
            roomCreator: _id,
            roomCode: roomCode,
            guideName: fullname,
            ...(tourDescription) && {tourDescription: tourDescription},
            ...(guidePack) && {guidePack: Types.ObjectId(guidePack)}
        })
        
        Room.save(err=>{
            if(err)
                throw err;

            return res.status(200).json({status: true, room: Room});
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
})

router.delete('/deleteRoom', authenticateMiddleware, (req,res)=>{
    try{
        const {roomId} = req.query;
        Rooms.deleteOne({roomCode: roomId}, (err)=>{
            if(err) throw err;
            
            return res.status(200).json({status: true});
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }

})

router.get('/getRoomByCode', (req,res)=>{
    try{
        const {roomCode} = req.query;
        Rooms.findOne({roomCode}, (err, room)=>{
            if(err) throw err;

            if(room){
                return res.status(200).json({room});
            }else{
                return res.status(200).send('room not found');
            }
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }
})

router.get('/getRoomByCreator', authenticateMiddleware, (req,res)=>{
    try{
        Rooms.findOne({creatorId: req.user._id},(err, room)=>{
            if(err) throw err;

            if(room){
                return res.status(200).json(room);
            }else{
                return res.status(200).send(false);
            }
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }
})

router.get('/getRoom', (req,res)=>{
    const {roomCode} = req.query;
    try{
        Rooms.findOne({roomCode}, (err,room)=>{
            if(err) throw err;

            if(room){
                return res.status(200).json(room);
            }else{
                return res.status(200).send(false);
            }
        })
    }catch(err){
        return res.status(500).send('something went wrong');
    }
})

router.get('/getListeners', (req,res)=>{
    const {roomCode} = req.query;
    try{
        Rooms.findOne({roomCode},["activeUsers"] ,(err,listeners)=>{
            if(err) throw err;

            if(listeners){
                return res.status(200).json({listeners: listeners.activeUsers});
            }
            return res.status(200).json({listeners: []})
        })
    }catch(err){
        return res.status(500).send("somthing went wrong");
    }

})

module.exports = router;