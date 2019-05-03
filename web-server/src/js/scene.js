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
        sceneFontFamily: 'monospace',
        sceneFontSize: '36',
        rotateY: 0,
        rotateZ: 0,
        sceneContentWidth: 576,
        sceneContentHeight: 360,
        sceneLetterSpacing: 0,
        sceneWordSpacing: 0,
        sceneScrollTo: 0,
        sceneScrollSpeed: 100,
        sceneScriptHeight: 360,
        syncScroll: false,
        sceneContent: '',
        socket: null,
        roomId: ''
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
            this.socket = io({})

            this.socket.on('connect', () => {
                console.log('on connect: ', this.socket.id);
            });

            hostInfo = {type:'host', url: document.URL}
            this.socket.emit('createRoom', hostInfo, (roomId, svgStr) => {
            // this.socket.emit('createRoom', 'host', (roomId) => {
                console.log('room id: ', roomId);
                $('.svg').append(svgStr)
                $('.client-url>a').attr('url', document.URL+'?r='+roomId)
                $('.client-url>a').text(document.URL+'?r='+roomId)

                this.roomId = roomId;
            });

            this.socket.on('client msg', (msg)=>{
                let msgObj = JSON.parse(msg);
                switch(msgObj.cmd) {
                    case 'resize':
                        this.resizeScriptContent({width: msgObj['width'], height: msgObj['height']});
                        break;
                    case 'requireContent':
                        let self = this
                        setTimeout(function() {
                            self.updateScriptContent(null, self.$refs.scriptContent.content)
                            self.updateScriptContentHeight()
                        }, 200);
                        break;
                }
            });
        },
        joinRoom: function (event) {
            if (window.location.search.split("?").length < 2) {
                return
            }

            this.socket = io({})
            let getParams = window.location.search.split("?")[1].split('&')
            for (let i = 0; i < getParams.length; i++) {
                if ("r" == getParams[i].split("=")[0]) {
                    this.roomId = getParams[i].split("=")[1];
                    console.log('room id: ', this.roomId);
                }
            }
            this.socket.on('connect', () => {
                console.log('on connect: ', this.socket.id);
                let data = {
                    roomid: this.roomId,
                    cmd: 'requireContent'
                }
                this.socket.emit('client message', JSON.stringify(data));
            });

            let deviceInfo = {
                deviceType: 'client',
                roomId: this.roomId,
                width: window.innerWidth,
                height: window.innerHeight
            }
            if (this.roomId.length > 0) {
                this.socket.emit('joinRoom', JSON.stringify(deviceInfo));
            }


            this.socket.on('host msg', (msg)=>{
                console.group('host msg');
                let msgObj = JSON.parse(msg);
                console.log(msgObj);
                switch(msgObj.cmd) {
                    case 'updateContent':
                        this.sceneContent = msgObj['value'];
                        break;
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
                    case 'scriptHeight':
                        this.sceneScriptHeight = msgObj['value'] + 70;
                        break;
                    case 'scrollTo':
                        this.sceneScrollTo  = msgObj['value'];
                        break;
                    case 'scrollingSpeed':
                        this.sceneScrollSpeed  = msgObj['value'];
                        break;
                    case 'rotateY':
                        this.rotateY = msgObj['value'];
                        break;
                    case 'rotateZ':
                        this.rotateZ = msgObj['value'];
                        break;
                    case 'clientAutoScroll':
                        this.$refs.scrollControl.autoScroll()
                        break;
                } 

                console.groupEnd('host msg');
            });
        },
        setSyncScroll: function (event) {
            console.log('change syncScroll to : ', !this.syncScroll)
            this.syncScroll = !this.syncScroll
        },
        updateScriptContent: function (event, childValue) {
            if (this.roomId.length == 0) return;
            let data = {
                roomid: this.roomId,
                cmd: 'updateContent', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
            this.updateScriptContentHeight()
        },
        updateScriptContentHeight: function (){
            if (this.roomId.length == 0) return;
            let textareaData = {
                roomid: this.roomId,
                cmd: 'scriptHeight', 
                value: $('textarea').innerHeight()
            }
            this.socket.emit('host message', JSON.stringify(textareaData));
        },
        onResize: function (event) {
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            };
            this.sceneContentWidth = window.innerWidth
            this.sceneContentHeight = window.innerHeight
            this.socket.emit('client message', JSON.stringify(data));
        },
        resizeScriptContent: function (contentDomSize) {
            this.sceneContentWidth = contentDomSize.width;
            this.sceneContentHeight = contentDomSize.height;
        },
        changeFontFamily: function (event, childValue){
            this.sceneFontFamily = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'fontFamily', 
                value: childValue
            };
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeFontSize: function (event, childValue){
            this.sceneFontSize = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'fontSize', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeLetterSpacing: function (event, childValue){
            this.sceneLetterSpacing = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'letterSpacing', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeWordSpacing: function (event, childValue){
            this.sceneWordSpacing = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'wordSpacing', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeFontColor: function (event, childValue){
            this.sceneFontColor = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'fontColor', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeBgColor: function (event, childValue){
            this.sceneBgColor = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'bgColor', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeScrollTo: function (event, childValue){
            // TODO comment this for dev
            if (!this.syncScroll) return
            this.sceneScrollTo = childValue;
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'scrollTo', 
                value: childValue
            }
            this.socket.emit('host message', JSON.stringify(data));
        },
        changeScrollingSpeed: function (event, childValue){
            this.sceneScrollSpeed = parseInt(childValue);
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'scrollingSpeed', 
                value: childValue
            };
            this.socket.emit('host message', JSON.stringify(data));
        },
        clientAutoScroll: function (){
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'clientAutoScroll'
            };
            this.socket.emit('host message', JSON.stringify(data));
        },
        flipY: function (event, degree) {
            if (degree !== undefined) {
                this.rotateY = degree  
            } else {
                if (this.rotateY == 180) {
                    this.rotateY = 0;
                }else {
                    this.rotateY = 180;
                }
            }
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'rotateY', 
                value: this.rotateY
            };
            if (this.socket) this.socket.emit('host message', JSON.stringify(data));
        },
        flipZ: function (event, degree) {
            if (degree !== undefined) {
                this.rotateZ = degree;
            } else {
                if (this.rotateZ == 180) {
                    this.rotateZ = 0;
                }else {
                    this.rotateZ = 180;
                }
            }
            if (this.roomId == undefined) return;
            let data = {
                roomid: this.roomId,
                cmd: 'rotateZ', 
                value: this.rotateZ
            };
            if (this.socket) this.socket.emit('host message', JSON.stringify(data));
        },
    },
    filters: {},
    computed: {},
    watch: {},
})


