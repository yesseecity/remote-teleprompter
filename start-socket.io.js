const http = require('http');
const app = require('./web-server/express-server');
const socketServer = require('socket.io');
const uniqid = require('uniqid');

webServer = http.createServer().listen(8080, ()=>{
    console.log('web socker server started!')
});
webServer.on('request', app)

io = new socketServer(webServer, {
    // transports: ['websocket']
})

io.on('connection', function(socket){
    console.log(socket.id, ' connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('createRoom', (name, fn) => {
        if (name == 'host') {
            let roomId = uniqid.time()
            fn(roomId)
            console.log(name , ', id: ', socket.id, 'request join room')
            
            socket.join(roomId, () => {
                let rooms = Object.keys(socket.rooms);
                // [ <socket.id>, 'room id' ]
                console.log(rooms);
                // broadcast to everyone in the room
                io.to(roomId).emit('a new user has joined the room');
            });
        }
    });
    socket.on('joinRoom', (name, roomId) => {
        if (name == 'client') {
            console.log(name , ', id: ', socket.id, 'request join room')
            socket.join(roomId, () => {
                let rooms = Object.keys(socket.rooms);
                // [ <socket.id>, 'room 237' ]
                console.log(rooms);
                // broadcast to everyone in the room
                io.to(roomId).emit('a new user has joined the room');
            });
        }
    });

    socket.on('client emit message', function(roomId, msg){
        console.log('client emit message: ' + msg);
        let roomSockets = io.sockets.adapter.rooms[roomId].sockets
        for (let id in roomSockets) {
            if (id !== socket.id) {
                io.to(id).emit('host message', 'hello Client your font family is '+ msg)
            }
        }
        
        // Emit message to all sockets in room
        // io.to(roomId).emit('host message', 'host emit message')
    });



});