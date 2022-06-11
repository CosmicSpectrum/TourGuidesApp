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

module.exports = router;