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
    socket.on('joinRoom', (msg) => {
        let msgObj = JSON.parse(msg);
        if (msgObj.deviceType === 'client' && msgObj.roomId.length > 0) {
            console.log('client,  id: ', socket.id, 'request join room')
            socket.join(msgObj.roomId, () => {
                let rooms = Object.keys(socket.rooms);

                console.log(rooms);
                // broadcast to everyone in the room
                // io.to(msgObj.roomId).emit('a new user has joined the room');

                let roomSockets = io.sockets.adapter.rooms[msgObj.roomId].sockets;
                for (let id in roomSockets) {
                    if (id !== socket.id) {
                        let cmdObj = {
                            cmd: 'resize',
                            width: msgObj.width,
                            height: msgObj.height,
                        }
                        io.to(id).emit('client msg', JSON.stringify(cmdObj))
                    }
                }
            });
        }
    });

    socket.on('client message', function(roomId, msg){
        console.log('client  message: ' + msg);
        let roomSockets = io.sockets.adapter.rooms[roomId].sockets;
        for (let id in roomSockets) {
            if (id !== socket.id) {
                io.to(id).emit('client msg', 'hello Client your font family is '+ msg)
            }
        }
        
        // Emit message to all sockets in room
        // io.to(roomId or socketId ).emit('host message', 'host emit message')
    });

    socket.on('host message', function(msg){
        console.log('host message')
        let msgObj = JSON.parse(msg);
        let roomId = msgObj.roomid;
        delete msgObj['roomid']
        console.log(msgObj)
        let roomSockets = io.sockets.adapter.rooms[roomId].sockets
        for (let id in roomSockets) {
            if (id !== socket.id) {
                console.log('emit host msg')
                io.to(id).emit('host msg', JSON.stringify(msgObj))
                // io.to(id).emit('host msg', 'aaaaa')
            }
        }
    });



});