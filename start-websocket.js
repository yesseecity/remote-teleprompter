var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express');
var app = require('./web-server/express-server');

web = http.createServer().listen(8080, ()=>{
    console.log('web socker server started!')
});

web.on('request', app)

var wsServer = new WebSocketServer({
    httpServer: web,
    fragmentOutgoingMessages: false
});


var connections = [];


wsServer.on('request', function(request) {
    // console.log(request)
    var connection = request.accept('remote-teleprompter', request.origin);
    connections.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    
    // Send all the existing canvas commands to the new client
    connection.sendUTF(JSON.stringify({
        msg: "initCommands",
        data: {'room_id': 'aaa', 'host_id': 'bbb'}
    }));
    
    // Handle closed connections
    connection.on('close', function() {
        console.log(connection.remoteAddress + " disconnected");
        
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
    });
    
    // Handle incoming messages
    connection.on('message', function(message) {
        console.log('on message: ', message)
        if (message.type === 'utf8') {
            try {
                var command = JSON.parse(message.utf8Data);

                // if (command.msg === 'clear') {
                //     // canvasCommands = [];
                // }
                // else {
                //     // canvasCommands.push(command);
                // }
                console.log('command: ', command)

                // rebroadcast command to all clients
                connections.forEach(function(destination) {
                    destination.sendUTF(message.utf8Data);
                });
            }
            catch(e) {
                // do nothing if there's an error.
            }
        }
    });
});