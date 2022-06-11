const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
require('dotenv').config({});
require("./libs/mongodb");
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const routes = require('require-all')({dirname: __dirname + '/routes'});

for(const route in routes){
    app.use(`/${route}`, routes[route]);
}

io.on('connection', (socket)=>{
    socket.on('join-room', (roomId, userId) => {
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