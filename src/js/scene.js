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

        }
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
            teleprompter_cli = new Teleprompter()
            console.log(teleprompter_cli)
            teleprompter_cli.connect(this.deviceType)
        },
        changeFontFamily: function(event, childValue){
            this.sceneFontFamily = childValue;
        },
        changeFontSize: function(event, childValue){
            this.sceneFontSize = childValue;
        },
        changeLetterSpacing: function(event, childValue){
            this.sceneFontSize = childValue;
        },
        changeWordSpacing: function(event, childValue){
            this.sceneFontSize = childValue;
        },
        changeFontColor: function(event, childValue){
            this.sceneFontSize = childValue;
        },
        changeBgColor: function(event, childValue){
            this.sceneFontSize = childValue;
        },
        changeScrollTo: function(event, childValue){
            this.sceneScrollInfo.scrollTo = praseInt(childValue);
        },
        changeScrollingSpeed: function(event, childValue){
            this.sceneScrollInfo.speed = parseInt(childValue);
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


