function Teleprompter (textAreaID) {
    // Define accepted commands
    this.hostMessageHandlers = {
        clientResize: this.clientResize.bind(this),
    };

    this.clientMessageHandlers = {
        // initCommands: this.initCommands.bind(this),
        // clear: this.clear.bind(this),
        chageText: this.chageText.bind(this),
        letterSpacing: this.letterSpacing.bind(this),
        wordSpacing: this.wordSpacing.bind(this),
        fontSize: this.fontSize.bind(this),
        fontColor: this.fontColor.bind(this),
        bgColor: this.bgColor.bind(this),
        scrollHeight: this.scrollHeight.bind(this),
        scrollingSpeed: this.scrollingSpeed.bind(this),
        autoScrollStart: this.autoScrollStart.bind(this),
        autoScrollEnd: this.autoScrollEnd.bind(this),
    };
}

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
Teleprompter.prototype.scrollHeight = function(data) {
};

Teleprompter.prototype.scrollingSpeed = function(data) {
};

Teleprompter.prototype.autoScrollStart = function(data) {
};

Teleprompter.prototype.autoScrollEnd = function(data) {
};



