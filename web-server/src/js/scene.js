var scene = new Vue({
    el: '#scene',
    components: {
        'script-content': scriptContent,
        'script-font-family': scriptFontFamily,
        'script-control-font': scriptControlFont,
        'script-control-scroll': scriptControlScroll,
    },
    data: {
        isMobile: false,
        deviceType: 'host',
        sceneFontFamily: 'Times New Roman',
        sceneFontSize: '48',
        rotateY: 0,
        rotateZ: 0,
        sceneContentWidth: 0,
        sceneContentHeight: 0,
        sceneScrollInfo: {
            scrollTo: 0,
            speed: 100,

        },
        sceneContent: '',
        socket: null,
        roomId: null
    },
    created: function(){
        let searchResult = navigator.userAgent.toLowerCase().search('mobile');
        this.isMobile = searchResult > -1;
        if (!this.isMobile) {
            this.deviceType = 'host';
        } else {
            this.deviceType = 'client';
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            if (this.deviceType == 'client') {
                window.addEventListener('resize', this.onResize);
                this.joinRoom();
            } 
        });
    },
    methods: {
        createRoom: function (event) {
            console.log('create room')  
            let teleprompter_cli = new Teleprompter()
            this.socket = teleprompter_cli.connect2(this.deviceType)

            this.socket.on('connect', () => {
                console.log('on connect: ', this.socket.id);
            });

            this.socket.emit('createRoom', 'host', (data) => {
                console.log('room id: ', data);
                this.roomId = data
            });

            // this.socket.emit('client emit message', 'aaaaa');
            // this.socket.emit('requset room id', 'aa', (roomId)=>{
            //     console.log('room id : ', roomId)
            // });
            this.socket.on('client msg', (msg)=>{
                let msgObj = JSON.parse(msg);
                console.log(msgObj);
                switch(msgObj.cmd) {
                    case 'resize':
                        this.resizeScriptContent({width: msgObj['width'], height: msgObj['height']});
                        break;
                }
            });
        },
        joinRoom: function (event) {
            if (window.location.search.split("?").length < 2) {
                return
            }

            let teleprompter_cli = new Teleprompter()
            this.socket = teleprompter_cli.connect2(this.deviceType)
            let getParams = window.location.search.split("?")[1].split('&')
            for (let i = 0; i < getParams.length; i++) {
                if ("r" == getParams[i].split("=")[0]) {
                    this.roomId = getParams[i].split("=")[1];
                    console.log('room id: ', this.roomId);
                }
            }
            this.socket.on('connect', () => {
                console.log('on connect: ', this.socket.id);
            });

            let deviceInfo = {
                deviceType: 'client',
                roomId: this.roomId,
                width: window.innerWidth,
                height: window.innerHeight
            }
            this.socket.emit('joinRoom', JSON.stringify(deviceInfo));


            this.socket.on('host msg', (msg)=>{
                console.group('host msg');
                let msgObj = JSON.parse(msg);
                console.log(msgObj);
                switch(msgObj.cmd) {
                    case 'fontFamily':
                        this.sceneFontFamily = msgObj['value'];
                        break;
                    case 'fontSize':
                        this.sceneFontSize = msgObj['value'];
                        break;
                    case 'letterSpacing':
                        this.sceneLetterSpacing = msgObj['value'];
                        break;
                    case 'wordSpacing':
                        this.sceneWordSpacing = msgObj['value'];
                        break;
                    case 'fontColor':
                        this.sceneFontColor = msgObj['value'];
                        break;
                    case 'bgColor':
                        this.sceneBgColor = msgObj['value'];
                        break;
                    case 'scrollTo':
                        this.sceneScrollInfo.scrollTo  = msgObj['value'];
                        break;
                    case 'scrollingSpeed':
                        this.sceneScrollInfo.speed  = msgObj['value'];
                        break;
                    case 'flipY':
                        this.rotateY = msgObj['value'];
                        break;
                    case 'flipZ':
                        this.rotateZ = msgObj['value'];
                        break;
                } 

                console.groupEnd('host msg');
            });
        },
        socketSend: function (data) {
            if (!this.isMobile) {
                // this.socket.send(JSON.stringify(data))
            }
        },
        onResize: function (event) {
            console.clear();
            // console.log('on window resize')
            // console.log(event)
            console.log(window.innerWidth, window.innerHeight)

            let data = {
                roomid: this.roomId,
                cmd: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            };
            this.socket.emit('client message', JSON.stringify(data));
        },
        resizeScriptContent: function (contentDomSize) {
            console.log(contentDomSize)
            this.sceneContentWidth = contentDomSize.width;
            this.sceneContentHeight = contentDomSize.height;
        },
        changeFontFamily: function(event, childValue){
            this.sceneFontFamily = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'fontFamily', 
                value: childValue
            };
            console.log(JSON.stringify(data))

            console.log(this.socket)
            // this.socket.emit('host message', JSON.stringify(data));
        },
        changeFontSize: function(event, childValue){
            this.sceneFontSize = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'fontSize', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeLetterSpacing: function(event, childValue){
            this.sceneLetterSpacing = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'letterSpacing', 
                value: childValue
            }
            if (this.disconnected)
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeWordSpacing: function(event, childValue){
            this.sceneWordSpacing = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'wordSpacing', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeFontColor: function(event, childValue){
            this.sceneFontColor = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'fontColor', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeBgColor: function(event, childValue){
            this.sceneBgColor = childValue;
            let data = {
                roomid: this.roomId,
                cmd: 'bgColor', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeScrollTo: function(event, childValue){
            this.sceneScrollInfo.scrollTo = praseInt(childValue);
            let data = {
                roomid: this.roomId,
                cmd: 'scrollTo', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeScrollingSpeed: function(event, childValue){
            this.sceneScrollInfo.speed = parseInt(childValue);
            let data = {
                roomid: this.roomId,
                cmd: 'scrollingSpeed', 
                value: childValue
            };
            this.socket.emit('host message', JSON.stringify(data));
        },
        flipY: function (degree) {
            if (degree !== undefined) {
                this.rotateY = degree  
            } else {
                if (this.rotateY == 180) {
                    this.rotateY = 0;
                }else {
                    this.rotateY = 180;
                }
            }
        },
        flipZ: function (degree) {
            if (degree !== undefined) {
                this.rotateZ = degree;
            } else {
                if (this.rotateZ == 180) {
                    this.rotateZ = 0;
                }else {
                    this.rotateZ = 180;
                }
            }
        },
    },
    filters: {},
    computed: {},
    watch: {},
})


