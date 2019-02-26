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
        socket: null,
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
            teleprompter_cli.connect(this.deviceType)
            this.socket = teleprompter_cli.socket
        },
        socketSend: function (data) {
            if (!this.isMobile) {
                this.socket.send(JSON.stringify(data))
            }
        },
        changeFontFamily: function(event, childValue){
            this.sceneFontFamily = childValue;
            this.socketSend({msg: 'fontFamily', value: childValue});
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


