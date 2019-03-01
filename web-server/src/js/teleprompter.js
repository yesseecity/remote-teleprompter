function Teleprompter () {
    // Define accepted commands
    // this.hostMessageHandlers = {
    //     clientResize: this.clientResize.bind(this),
    // };

    this.clientMessageHandlers = {
        // initCommands: this.initCommands.bind(this),
        // clear: this.clear.bind(this),
        // chageText: this.chageText.bind(this),
        // letterSpacing: this.letterSpacing.bind(this),
        // wordSpacing: this.wordSpacing.bind(this),
        // fontSize: this.fontSize.bind(this),
        // fontColor: this.fontColor.bind(this),
        // bgColor: this.bgColor.bind(this),
        // scrollTop: this.scrollTop.bind(this),
        // scrollingSpeed: this.scrollingSpeed.bind(this),
        // autoScrollStart: this.autoScrollStart.bind(this),
        // autoScrollEnd: this.autoScrollEnd.bind(this),
    };
}

Teleprompter.prototype.connect = function(deviceType) {
    var url = "ws://" + document.URL.substr(7).split('/')[0];
    var url = "ws://" + '127.0.0.1:8080';
    
    var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new wsCtor(url, 'remote-teleprompter');

    this.socket.onmessage = this.websocketOnMessage.bind(this);
    this.socket.onclose = this.websocketOnClose.bind(this);
    // setTimeout(function() {
    //     this.socket.send(JSON.stringify({ msg: 'createRoom', deviceType: 'mobile'}));
    // }, 1000);
};

Teleprompter.prototype.connect2 = function(deviceType) {
    // Create connection
    var socket = io({
        // transports: ['websocket']
    });

    return socket
};


Teleprompter.prototype.websocketOnMessage = function(message) {
    try {
        console.log(message)
        // var command = JSON.parse(message.data);
    }
    catch(e) { /* do nothing */ }
    
    // if (command) {
    //     // this.dispatchCommand(command);
    //     console.log(command)
    // }
};

Teleprompter.prototype.websocketOnClose = function(data) {
    console.log("WebSocket Connection Closed.");
};



Teleprompter.prototype.clientResize = function(data) {
};

Teleprompter.prototype.chageText = function(data) {
};

Teleprompter.prototype.letterSpacing = function(data) {
};

Teleprompter.prototype.wordSpacing = function(data) {
};

Teleprompter.prototype.fontSize = function(data) {
};

Teleprompter.prototype.fontColor = function(data) {
};

Teleprompter.prototype.bgColor = function(data) {
};

Teleprompter.prototype.scrollTop = function(data) {
};

Teleprompter.prototype.scrollingSpeed = function(data) {
};

Teleprompter.prototype.autoScrollStart = function(data) {
};

Teleprompter.prototype.autoScrollEnd = function(data) {
};



