const http = require('http');
const app = require('./web-server/express-server');
const socketServer = require('socket.io');
const uniqid = require('uniqid');
const qr = require('qr-image');

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

    socket.on('createRoom', (info, fn) => {
        if (info.type == 'host') {
            const roomId = uniqid.time()
            const url = info.url+'?r='+roomId
            const svgStr = qr.imageSync(url, {type:'svg'});
            
            fn(roomId, svgStr)
            console.log(info.type , ', id: ', socket.id, 'request join room')
            
            socket.join(roomId, () => {
                let rooms = Object.keys(socket.rooms);
                // [ <socket.id>, 'room id' ]
                // console.log(rooms);
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
                const rooms = Object.keys(socket.rooms);

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

    socket.on('client message', function(msg){
        console.log('client  message');
        console.log(msg)
        let msgObj = JSON.parse(msg);
        let roomId = msgObj.roomid;
        let room = io.sockets.adapter.rooms[roomId]
        delete msgObj['roomid']
        if (room == undefined) {
            return
        }
        let roomSockets = room.sockets;
        for (let id in roomSockets) {
            if (id !== socket.id) {
                io.to(id).emit('client msg',  JSON.stringify(msgObj))
            }
        }
        
        // Emit message to all sockets in room
        // io.to(roomId or socketId ).emit('host message', 'host emit message')
    });

    socket.on('host message', function(msg){
        console.log('host message')
        console.log(msg)
        let msgObj = JSON.parse(msg);
        let roomId = msgObj.roomid;
        let room = io.sockets.adapter.rooms[roomId]
        delete msgObj['roomid']
        if (room == undefined) {
            return
        }
        let roomSockets = room.sockets
        for (let id in roomSockets) {
            if (id !== socket.id) {
                io.to(id).emit('host msg', JSON.stringify(msgObj))
            }
        }
    });



});