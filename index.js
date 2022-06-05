const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket)=>{
    socket.on('join-room', (roomId, userId) => {
        console.log(userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    })
})

server.listen(3001, ()=>{
    console.log('Server listening on 3001');
})