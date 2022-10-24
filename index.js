const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const ListenersUtils = require('./utils/listeners.utils');
require('dotenv').config({});
require("./libs/mongodb");
const Cors = require('cors');
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '/broadcaster-ui/build')));
app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const routes = require('require-all')({dirname: __dirname + '/routes'});

for(const route in routes){
    app.use(`/${route}`, routes[route]);
}

io.on('connection', (socket)=>{
    socket.on('join-room', (roomId, userId,isAdmin) => {
        if(!isAdmin){
            ListenersUtils.addNewListener(userId,roomId).catch(err=>{
                console.log("adding user to array failed because: " + err.message);
            })
        }

        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId)
    })

    socket.on("roomEnded", (roomId)=>{
        socket.broadcast.to(roomId).emit('room-closed');
        socket.leave(roomId);
    })

    socket.on("showFile", (fileId, roomId)=>{
        socket.broadcast.to(roomId).emit('getFile',fileId);
    })

    socket.on('playVideo', (roomId)=>{
        socket.broadcast.to(roomId).emit('startMedia');
    })


    socket.on('pauseVideo', (roomId)=>{
        socket.broadcast.to(roomId).emit('stopMedia');
    })

    socket.on('playAudio', (roomId)=>{
        socket.broadcast.to(roomId).emit('startMedia');
    })

    socket.on('pauseAudio', (roomId)=>{
        socket.broadcast.to(roomId).emit('stopMedia');
    })

    socket.on('userLeave', (roomId, userId)=>{
        ListenersUtils.removeListener(userId,roomId).catch(err=>{
            console.log("remove user operation faild because: " + err.message);
        })
        socket.leave(roomId);
    })
})

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname+'/broadcaster-ui/build/index.html'));
})

server.listen(process.env.PORT, ()=>{
    console.log(`Server listening on ${process.env.PORT} `);
})

