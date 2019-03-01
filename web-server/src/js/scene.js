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
        sceneStyle: {
            fontFamily: 'Times New Roman',
            size: '18px',
            color: 'initial',
            backgroundColor: 'initial',
        },
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

            this.socket.on('host message', (msg)=>{
                console.group('host message')
                console.log(msg)
                console.groupEnd('host message')
            });
        },
        joinRoom: function (event) {
            let teleprompter_cli = new Teleprompter()
            this.socket = teleprompter_cli.connect2(this.deviceType)

            let getParams = window.location.search.split("?")[1].split('&')
            for (let i = 0; i < getParams.length; i++) {
                if ("r" == getParams[i].split("=")[0]) {
                    this.roomId = getParams[i].split("=")[1]
                    console.log('room id: ', this.roomId)
                }
            }
            this.socket.emit('joinRoom', 'client', this.roomId);

            this.socket.on('host message', (msg)=>{
                console.group('host message')
                console.log(msg)
                console.groupEnd('host message')
            });
        },
        socketSend: function (data) {
            if (!this.isMobile) {
                // this.socket.send(JSON.stringify(data))
            }
        },
        changeFontFamily: function(event, childValue){
            this.sceneFontFamily = childValue;
            // this.socketSend({msg: 'fontFamily', value: childValue});
            this.socket.emit('client emit message', this.roomId, childValue);
        },
        changeFontSize: function(event, childValue){
            this.sceneFontSize = childValue;
            this.socketSend({msg: 'fontSize', value: childValue});
        },
        changeLetterSpacing: function(event, childValue){
            this.sceneLetterSpacing = childValue;
            this.socketSend({msg: 'letterSpacing', value: childValue});
        },
        changeWordSpacing: function(event, childValue){
            this.sceneWordSpacing = childValue;
            this.socketSend({msg: 'wordSpacing', value: childValue});
        },
        changeFontColor: function(event, childValue){
            this.sceneFontColor = childValue;
            this.socketSend({msg: 'fontColor', value: childValue});
        },
        changeBgColor: function(event, childValue){
            this.sceneBgColor = childValue;
            this.socketSend({msg: 'bgColor', value: childValue});
        },
        changeScrollTo: function(event, childValue){
            this.sceneScrollInfo.scrollTo = praseInt(childValue);
            this.socketSend({msg: 'scrollTo', value: childValue});
        },
        changeScrollingSpeed: function(event, childValue){
            this.sceneScrollInfo.speed = parseInt(childValue);
            this.socketSend({msg: 'scrollingSpeed', value: childValue});
        },
        flipY: function () {
            if (this.rotateY == 180) {
                this.rotateY = 0
            }else {
                this.rotateY = 180
            }
        },
        flipZ: function () {
            if (this.rotateZ == 180) {
                this.rotateZ = 0
            }else {
                this.rotateZ = 180
            }
        },
    },
    filters: {},
    computed: {},
    watch: {},
})


