// Local Registration
var scriptContent = {
    props: [
        'contentWidth',
        'contentHeight',
        'contentLetterSpacing',
        'contentWordSpacing',
        'contentScrollTo',
        'contentScrollSpeed',
        'contentScriptHeight',
        'fontFamily',
        'fontSize',
        'isMobile',
        'rotateY',
        'rotateZ',
        'sceneContent',
    ],
    template: `
        <div class="script-content" 
            v-bind:style="contentStyle"
            v-bind:class="dymainicClass" 
            v-on:scroll='onScroll'
            >
            <textarea 
                v-if="isMobile"
                v-bind:style="textareaStyle" 
                v-bind:readonly="isMobile"
                v-on:click='doubletap'
                v-model="sceneContent" 
            >

            </textarea>
            <textarea
                v-else
                v-bind:style="textareaStyle" 
                v-bind:class="dymainicClass"
                v-on:blur='sendContents'
                v-model="content" 
                placeholder="Input your script content"
            >
            </textarea>
        </div>
    `,
    data: function() {
        return {
            content: `123456789012345678901234567890
data: {
    isMobile: false,
    deviceType: 'host',
    sceneFontFamily: 'monospace',
    sceneFontSize: '48',
    rotateY: 0,
    rotateZ: 0,
    sceneContentWidth: 516,
    sceneContentHeight: 320,
    sceneLetterSpacing: 0,
    sceneWordSpacing: 0,
    sceneScrollTo: 0,
    sceneScrollSpeed: 100,
    sceneScriptHeight: 320,
    syncScroll: false,
    sceneContent: '',
    socket: null,
    roomId: ''
}`,
            mylatesttap: 0,
            inFullScreen: false,
            scrollingSpeed: 30,
        }
    },
    mounted: function () {
        if (!this.isMobile) {
            autosize($('textarea'));
        } else {
            $('textarea').width(window.innerWidth)
        }
    },
    methods: {
        doubletap: function() {
            var now = new Date().getTime();
            var timesince = now - this.mylatesttap;
            if((timesince < 600) && (timesince > 0)){
                // double tap  
                if (this.isMobile) {
                    if (this.inFullScreen) {
                        this.exitFullScreen();
                    } else {
                        this.toFullScreen();
                    }
                }
            }else{
                    // too much time to be a doubletap
            }
            this.mylatesttap = new Date().getTime();
        },
        sendContents: function (event) {
            if (this.content.length == 0) {
                return
            }
            this.$emit('pass-script-content', event, this.content);
        },
        onScroll: function (event) {
            if (!this.isMobile) {
                let scrollTop = this.$el.scrollTop
                this.$emit('pass-scroll-to', event, scrollTop);
            }
        },
        scrollTo: function (position) {
            // this.$el.scrollTop = position
            // this.$el.scrollBy({
            //   top: position,
            //   behavior: 'smooth'
            // });
            this.$el.scrollTop = position;
        },
        toFullScreen: function () {
            this.$el.requestFullscreen();
            this.inFullScreen = true;
        },
        exitFullScreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.cancelFullScreen) {
                // for FireFox
                document.cancelFullScreen()
            }
            this.inFullScreen = false;
        },
    },
    filters: {},
    computed: {
        contentStyle: function () {
            let defaultStyle = {}
            if (!this.isMobile) {
                if (this.contentWidth !== 0) {
                    defaultStyle['width'] = this.contentWidth + 'px'
                }
                if (this.contentHeight !== 0) {
                    defaultStyle['height'] = this.contentHeight + 'px'
                }
            } 
            return defaultStyle
        },
        textareaStyle: function () {
            let cssStyle = {
                fontFamily: this.fontFamily,
                fontSize: this.fontSize + 'px',
                transform: this.transform,
                letterSpacing: this.contentLetterSpacing + 'px',
                wordSpacing: this.contentWordSpacing + 'px'
            }
            if (this.contentWidth !== 0) {
                cssStyle['width'] = this.contentWidth + 'px'
            }
            if (!this.isMobile) {
                cssStyle['min-height'] = this.contentScriptHeight + 'px'
                setTimeout(function() {
                    autosize.update($('textarea'))
                }, 50);
            } else {
                if (this.contentScriptHeight !== 0) {
                    cssStyle['height'] = this.contentScriptHeight + 60 + 'px'
                }
                cssStyle['min-height'] = window.innerHeight + 'px'
            }
            return cssStyle
        },
        dymainicClass: function () {
            if (this.isMobile) {
                return 'mobile-view'
            } else {
                return ''
            }
        },
        transform: function () {
            return 'rotateY('+this.rotateY+'deg) rotateZ('+this.rotateZ+'deg) ' 
        },
    },
    watch: {
        contentScrollTo: function (value) {
            this.scrollTo(value)
        }
    }
}



// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptControlFont = {
    template: `
        <div>
            <label for="script-control-font-family">Font family</label>
            <select class="script-control-font-family" id="script-control-font-family" v-model="localFontFamily" @change=changeFontFamily()>
                <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                    <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
                </optgroup>
            </select>
            <br>
            <label for="script-control-font-size">Font Size</label>
            <input id="script-control-font-size" class="font-size" v-model="localFontSize" @change=changeFontSize($event) type="number">
            <label for="script-control-letter-spacing">Letter spacing</label>
            <input id="script-control-letter-spacing" 
                   class="letter-spacing" 
                   type="number" 
                   min="0" 
                   max="10" 
                   v-model="locaLetterSpacing"
                   @change=changeLetterSpacing($event)
                   >
            <label for="script-control-word-spacing">Word spacing</label>
            <input id="script-control-word-spacing" 
                   class="word-spacing" 
                   type="number" 
                   min="0" 
                   max="10" 
                   v-model="locaWordSpacing"
                   @change=changeWordSpacing($event)
                   >
        </div>
    `,
    data: function() {
        return {
            localFontSize: 36,
            localFontFamily: 'monospace',
            locaLetterSpacing: 0,
            locaWordSpacing: 0,
            fonts: {
                'serif': [
                    'Garamond',
                    'Georgia',
                    'Palatino',
                    'Times New Roman',
                    'Times',
                    'Bookman',
                ],
                'sans-serif':[
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Grande',
                    'Tahoma',
                    'Trebuchet MS',
                    'Helvetica',
                    'Verdana',
                ],
                'monospace': [
                    'monospace',
                    'Courier',
                    'Courier New',
                    'MS Gothic',
                    'MS PGothic',
                    'MS UI Gothic',
                    'MS Mincho',
                    'MS PMincho',
                    'NSimSun',
                    'SimSun',

                ]
            }
        }
    },
    methods: {
        changeLetterSpacing: function (event) {
            this.$emit('pass-letter-spacing', event, this.locaLetterSpacing);
        },
        changeWordSpacing: function (event) {
            this.$emit('pass-word-spacing', event, this.locaWordSpacing);
        },
        changeFontSize: function(event){
            this.$emit('pass-font-size', event, this.localFontSize);
        },
        changeFontFamily: function(event){
            this.$emit('pass-font-family', event, this.localFontFamily);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}


// Global Registration
Vue.component('global-script-font-family', {
    template: `
        <select class="script-control" id="script-control" v-model="fontFamily" @change=changeFontFamily()>
            <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
            </optgroup>
        </select>
    `,
    data: function() {
        return {
            fontFamily: 'Garamond',
            fonts: {
                'serif': [
                    'Garamond',
                    'Georgia',
                    'Palatino',
                    'Times New Roman',
                    'Times',
                    'Bookman',
                ],
                'sans-serif':[
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Grande',
                    'Tahoma',
                    'Trebuchet MS',
                    'Helvetica',
                    'Verdana',
                ],
                'monospace': [
                    'Courier',
                    'Courier New'
                ]
            }
        }
    },
    methods: {
        changeFontFamily: function(event){
            console.log(this.fontFamily)
        }
    },
    filters: {},
    computed: {},
    watch: {},
})

// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptFontFamily = {
    template: `
        <select class="script-font-family" id="script-font-family" v-model="localFontFamily" @change=changeFontFamily($event)>
            <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
            </optgroup>
        </select>
    `,
    data: function() {
        return {
            localFontFamily: 'Times New Roman',
            fonts: {
                'serif': [
                    'Garamond',
                    'Georgia',
                    'Palatino',
                    'Times New Roman',
                    'Times',
                    'Bookman',
                ],
                'sans-serif':[
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Grande',
                    'Tahoma',
                    'Trebuchet MS',
                    'Helvetica',
                    'Verdana',
                    'Microsoft JhengHei'
                ],
                'monospace': [
                    'Courier',
                    'Courier New'
                ]
            }
        }
    },
    methods: {
        changeFontFamily: function(event){
            // console.log(event)
            this.$emit('pass-font-family', event, this.localFontFamily);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}


// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptControlScroll = {
    props: [
        'rotateZ'
    ],
    template: `
        <div>
            <label>Auto Scrolling Speed</label>
            <input class="script-scroll-speed" v-model="localScrollSpeed" @change=changeScrollSpeed($event) type="number">
            <label>Auto Scroll:</label>
            <button @click="autoScroll">Auto Scroll Start</button>
            <button @click="clientAutoScroll">Client Auto Scroll</button>
        </div>
    `,
    data: function() {
        return {
            localScrollSpeed: 30
        }
    },
    methods: {
        changeScrollSpeed: function(event){
            this.$emit('pass-scrolling-speed', event, this.localScrollSpeed);
        },
        autoScroll: function () {
            var previousScrollTop = 0
            var scrollDelay = null
            var rotateZ = this.rotateZ
            function pageScroll() {
                let scrollTarget = $('.script-content')
                if (rotateZ == 0) {
                    scrollTarget.animate({scrollTop: "+=1px" }, 0, 'linear', function(){ scrollTarget.clearQueue(); });
                } else {
                    scrollTarget.animate({scrollTop: "-=1px" }, 0, 'linear', function(){ scrollTarget.clearQueue(); });
                }


                clearTimeout(scrollDelay);
                scrollDelay = setTimeout(pageScroll, this.localScrollSpeed);

                if(previousScrollTop - parseInt(scrollTarget.scrollTop()) > 2 ){
                    console.log('clearTimeout')
                    clearTimeout(scrollDelay);
                }
                previousScrollTop = parseInt(scrollTarget.scrollTop())

                if(scrollTarget.scrollTop() >= ( ( scrollTarget[0].scrollHeight - scrollTarget.height() ))){
                  clearTimeout(scrollDelay);
                  // back to top
                  // setTimeout(function(){
                  //   $('.script-content').stop().animate({scrollTop: 0}, 500, 'swing', function(){ $('.script-content').clearQueue(); });
                  // }, 500);
                }
            }
            pageScroll()
        },
        clientAutoScroll: function (){
            this.$emit('pass-client-auto-scroll');
        }
    },
    filters: {},
    computed: {},
    watch: {},
}


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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC1jb250ZW50LmpzIiwic2NyaXB0LWNvbnRyb2wtZm9udC5qcyIsInNjcmlwdC1jb250cm9sLWZvbnQtZmFtaWx5LmpzIiwic2NyaXB0LWNvbnRyb2wtc2Nyb2xsLmpzIiwic2NlbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExvY2FsIFJlZ2lzdHJhdGlvblxudmFyIHNjcmlwdENvbnRlbnQgPSB7XG4gICAgcHJvcHM6IFtcbiAgICAgICAgJ2NvbnRlbnRXaWR0aCcsXG4gICAgICAgICdjb250ZW50SGVpZ2h0JyxcbiAgICAgICAgJ2NvbnRlbnRMZXR0ZXJTcGFjaW5nJyxcbiAgICAgICAgJ2NvbnRlbnRXb3JkU3BhY2luZycsXG4gICAgICAgICdjb250ZW50U2Nyb2xsVG8nLFxuICAgICAgICAnY29udGVudFNjcm9sbFNwZWVkJyxcbiAgICAgICAgJ2NvbnRlbnRTY3JpcHRIZWlnaHQnLFxuICAgICAgICAnZm9udEZhbWlseScsXG4gICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICdpc01vYmlsZScsXG4gICAgICAgICdyb3RhdGVZJyxcbiAgICAgICAgJ3JvdGF0ZVonLFxuICAgICAgICAnc2NlbmVDb250ZW50JyxcbiAgICBdLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzY3JpcHQtY29udGVudFwiIFxuICAgICAgICAgICAgdi1iaW5kOnN0eWxlPVwiY29udGVudFN0eWxlXCJcbiAgICAgICAgICAgIHYtYmluZDpjbGFzcz1cImR5bWFpbmljQ2xhc3NcIiBcbiAgICAgICAgICAgIHYtb246c2Nyb2xsPSdvblNjcm9sbCdcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSBcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXNNb2JpbGVcIlxuICAgICAgICAgICAgICAgIHYtYmluZDpzdHlsZT1cInRleHRhcmVhU3R5bGVcIiBcbiAgICAgICAgICAgICAgICB2LWJpbmQ6cmVhZG9ubHk9XCJpc01vYmlsZVwiXG4gICAgICAgICAgICAgICAgdi1vbjpjbGljaz0nZG91YmxldGFwJ1xuICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJzY2VuZUNvbnRlbnRcIiBcbiAgICAgICAgICAgID5cblxuICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICAgIHYtZWxzZVxuICAgICAgICAgICAgICAgIHYtYmluZDpzdHlsZT1cInRleHRhcmVhU3R5bGVcIiBcbiAgICAgICAgICAgICAgICB2LWJpbmQ6Y2xhc3M9XCJkeW1haW5pY0NsYXNzXCJcbiAgICAgICAgICAgICAgICB2LW9uOmJsdXI9J3NlbmRDb250ZW50cydcbiAgICAgICAgICAgICAgICB2LW1vZGVsPVwiY29udGVudFwiIFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSW5wdXQgeW91ciBzY3JpcHQgY29udGVudFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGVudDogYDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MFxuZGF0YToge1xuICAgIGlzTW9iaWxlOiBmYWxzZSxcbiAgICBkZXZpY2VUeXBlOiAnaG9zdCcsXG4gICAgc2NlbmVGb250RmFtaWx5OiAnbW9ub3NwYWNlJyxcbiAgICBzY2VuZUZvbnRTaXplOiAnNDgnLFxuICAgIHJvdGF0ZVk6IDAsXG4gICAgcm90YXRlWjogMCxcbiAgICBzY2VuZUNvbnRlbnRXaWR0aDogNTE2LFxuICAgIHNjZW5lQ29udGVudEhlaWdodDogMzIwLFxuICAgIHNjZW5lTGV0dGVyU3BhY2luZzogMCxcbiAgICBzY2VuZVdvcmRTcGFjaW5nOiAwLFxuICAgIHNjZW5lU2Nyb2xsVG86IDAsXG4gICAgc2NlbmVTY3JvbGxTcGVlZDogMTAwLFxuICAgIHNjZW5lU2NyaXB0SGVpZ2h0OiAzMjAsXG4gICAgc3luY1Njcm9sbDogZmFsc2UsXG4gICAgc2NlbmVDb250ZW50OiAnJyxcbiAgICBzb2NrZXQ6IG51bGwsXG4gICAgcm9vbUlkOiAnJ1xufWAsXG4gICAgICAgICAgICBteWxhdGVzdHRhcDogMCxcbiAgICAgICAgICAgIGluRnVsbFNjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxpbmdTcGVlZDogMzAsXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJ3RleHRhcmVhJykud2lkdGgod2luZG93LmlubmVyV2lkdGgpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgZG91YmxldGFwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lc2luY2UgPSBub3cgLSB0aGlzLm15bGF0ZXN0dGFwO1xuICAgICAgICAgICAgaWYoKHRpbWVzaW5jZSA8IDYwMCkgJiYgKHRpbWVzaW5jZSA+IDApKXtcbiAgICAgICAgICAgICAgICAvLyBkb3VibGUgdGFwICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbkZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhpdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9GdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9vIG11Y2ggdGltZSB0byBiZSBhIGRvdWJsZXRhcFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5teWxhdGVzdHRhcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZW5kQ29udGVudHM6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kZW1pdCgncGFzcy1zY3JpcHQtY29udGVudCcsIGV2ZW50LCB0aGlzLmNvbnRlbnQpO1xuICAgICAgICB9LFxuICAgICAgICBvblNjcm9sbDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVG9wID0gdGhpcy4kZWwuc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgncGFzcy1zY3JvbGwtdG8nLCBldmVudCwgc2Nyb2xsVG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgICAgLy8gdGhpcy4kZWwuc2Nyb2xsVG9wID0gcG9zaXRpb25cbiAgICAgICAgICAgIC8vIHRoaXMuJGVsLnNjcm9sbEJ5KHtcbiAgICAgICAgICAgIC8vICAgdG9wOiBwb3NpdGlvbixcbiAgICAgICAgICAgIC8vICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNjcm9sbFRvcCA9IHBvc2l0aW9uO1xuICAgICAgICB9LFxuICAgICAgICB0b0Z1bGxTY3JlZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICB0aGlzLmluRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGV4aXRGdWxsU2NyZWVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBmb3IgRmlyZUZveFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbkZ1bGxTY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGZpbHRlcnM6IHt9LFxuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIGNvbnRlbnRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGRlZmF1bHRTdHlsZSA9IHt9XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50V2lkdGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFN0eWxlWyd3aWR0aCddID0gdGhpcy5jb250ZW50V2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRIZWlnaHQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFN0eWxlWydoZWlnaHQnXSA9IHRoaXMuY29udGVudEhlaWdodCArICdweCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRTdHlsZVxuICAgICAgICB9LFxuICAgICAgICB0ZXh0YXJlYVN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY3NzU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogdGhpcy5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMudHJhbnNmb3JtLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IHRoaXMuY29udGVudExldHRlclNwYWNpbmcgKyAncHgnLFxuICAgICAgICAgICAgICAgIHdvcmRTcGFjaW5nOiB0aGlzLmNvbnRlbnRXb3JkU3BhY2luZyArICdweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRXaWR0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNzc1N0eWxlWyd3aWR0aCddID0gdGhpcy5jb250ZW50V2lkdGggKyAncHgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBjc3NTdHlsZVsnbWluLWhlaWdodCddID0gdGhpcy5jb250ZW50U2NyaXB0SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9zaXplLnVwZGF0ZSgkKCd0ZXh0YXJlYScpKVxuICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudFNjcmlwdEhlaWdodCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjc3NTdHlsZVsnaGVpZ2h0J10gPSB0aGlzLmNvbnRlbnRTY3JpcHRIZWlnaHQgKyA2MCArICdweCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3NzU3R5bGVbJ21pbi1oZWlnaHQnXSA9IHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjc3NTdHlsZVxuICAgICAgICB9LFxuICAgICAgICBkeW1haW5pY0NsYXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbW9iaWxlLXZpZXcnXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAncm90YXRlWSgnK3RoaXMucm90YXRlWSsnZGVnKSByb3RhdGVaKCcrdGhpcy5yb3RhdGVaKydkZWcpICcgXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgICBjb250ZW50U2Nyb2xsVG86IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iLCIvLyBMb2NhbCBSZWdpc3RyYXRpb25cbi8vIOW/hemcgOWwh2NvbXBvbmVudOWvq+WcqHZ1ZSBpbnN0YW5jZeijoemdouOAgihzY2VuZS5qcylcbnZhciBzY3JpcHRDb250cm9sRm9udCA9IHtcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNjcmlwdC1jb250cm9sLWZvbnQtZmFtaWx5XCI+Rm9udCBmYW1pbHk8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNjcmlwdC1jb250cm9sLWZvbnQtZmFtaWx5XCIgaWQ9XCJzY3JpcHQtY29udHJvbC1mb250LWZhbWlseVwiIHYtbW9kZWw9XCJsb2NhbEZvbnRGYW1pbHlcIiBAY2hhbmdlPWNoYW5nZUZvbnRGYW1pbHkoKT5cbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgdi1mb3I9XCJmb250VHlwZSBpbiBPYmplY3Qua2V5cyhmb250cylcIiA6bGFiZWw9XCJmb250VHlwZVwiPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHYtZm9yPVwiZm9udCBpbiBmb250c1tmb250VHlwZV1cIiA6dmFsdWU9XCJmb250XCI+e3tmb250fX08L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8YnI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic2NyaXB0LWNvbnRyb2wtZm9udC1zaXplXCI+Rm9udCBTaXplPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInNjcmlwdC1jb250cm9sLWZvbnQtc2l6ZVwiIGNsYXNzPVwiZm9udC1zaXplXCIgdi1tb2RlbD1cImxvY2FsRm9udFNpemVcIiBAY2hhbmdlPWNoYW5nZUZvbnRTaXplKCRldmVudCkgdHlwZT1cIm51bWJlclwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNjcmlwdC1jb250cm9sLWxldHRlci1zcGFjaW5nXCI+TGV0dGVyIHNwYWNpbmc8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwic2NyaXB0LWNvbnRyb2wtbGV0dGVyLXNwYWNpbmdcIiBcbiAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxldHRlci1zcGFjaW5nXCIgXG4gICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiIFxuICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIiBcbiAgICAgICAgICAgICAgICAgICBtYXg9XCIxMFwiIFxuICAgICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJsb2NhTGV0dGVyU3BhY2luZ1wiXG4gICAgICAgICAgICAgICAgICAgQGNoYW5nZT1jaGFuZ2VMZXR0ZXJTcGFjaW5nKCRldmVudClcbiAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic2NyaXB0LWNvbnRyb2wtd29yZC1zcGFjaW5nXCI+V29yZCBzcGFjaW5nPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInNjcmlwdC1jb250cm9sLXdvcmQtc3BhY2luZ1wiIFxuICAgICAgICAgICAgICAgICAgIGNsYXNzPVwid29yZC1zcGFjaW5nXCIgXG4gICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiIFxuICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIiBcbiAgICAgICAgICAgICAgICAgICBtYXg9XCIxMFwiIFxuICAgICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJsb2NhV29yZFNwYWNpbmdcIlxuICAgICAgICAgICAgICAgICAgIEBjaGFuZ2U9Y2hhbmdlV29yZFNwYWNpbmcoJGV2ZW50KVxuICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvY2FsRm9udFNpemU6IDM2LFxuICAgICAgICAgICAgbG9jYWxGb250RmFtaWx5OiAnbW9ub3NwYWNlJyxcbiAgICAgICAgICAgIGxvY2FMZXR0ZXJTcGFjaW5nOiAwLFxuICAgICAgICAgICAgbG9jYVdvcmRTcGFjaW5nOiAwLFxuICAgICAgICAgICAgZm9udHM6IHtcbiAgICAgICAgICAgICAgICAnc2VyaWYnOiBbXG4gICAgICAgICAgICAgICAgICAgICdHYXJhbW9uZCcsXG4gICAgICAgICAgICAgICAgICAgICdHZW9yZ2lhJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BhbGF0aW5vJyxcbiAgICAgICAgICAgICAgICAgICAgJ1RpbWVzIE5ldyBSb21hbicsXG4gICAgICAgICAgICAgICAgICAgICdUaW1lcycsXG4gICAgICAgICAgICAgICAgICAgICdCb29rbWFuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdzYW5zLXNlcmlmJzpbXG4gICAgICAgICAgICAgICAgICAgICdBcmlhbCcsXG4gICAgICAgICAgICAgICAgICAgICdBcmlhbCBCbGFjaycsXG4gICAgICAgICAgICAgICAgICAgICdDb21pYyBTYW5zIE1TJyxcbiAgICAgICAgICAgICAgICAgICAgJ0ltcGFjdCcsXG4gICAgICAgICAgICAgICAgICAgICdMdWNpZGEgR3JhbmRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ1RhaG9tYScsXG4gICAgICAgICAgICAgICAgICAgICdUcmVidWNoZXQgTVMnLFxuICAgICAgICAgICAgICAgICAgICAnSGVsdmV0aWNhJyxcbiAgICAgICAgICAgICAgICAgICAgJ1ZlcmRhbmEnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ21vbm9zcGFjZSc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ21vbm9zcGFjZScsXG4gICAgICAgICAgICAgICAgICAgICdDb3VyaWVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ0NvdXJpZXIgTmV3JyxcbiAgICAgICAgICAgICAgICAgICAgJ01TIEdvdGhpYycsXG4gICAgICAgICAgICAgICAgICAgICdNUyBQR290aGljJyxcbiAgICAgICAgICAgICAgICAgICAgJ01TIFVJIEdvdGhpYycsXG4gICAgICAgICAgICAgICAgICAgICdNUyBNaW5jaG8nLFxuICAgICAgICAgICAgICAgICAgICAnTVMgUE1pbmNobycsXG4gICAgICAgICAgICAgICAgICAgICdOU2ltU3VuJyxcbiAgICAgICAgICAgICAgICAgICAgJ1NpbVN1bicsXG5cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2hhbmdlTGV0dGVyU3BhY2luZzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwYXNzLWxldHRlci1zcGFjaW5nJywgZXZlbnQsIHRoaXMubG9jYUxldHRlclNwYWNpbmcpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VXb3JkU3BhY2luZzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwYXNzLXdvcmQtc3BhY2luZycsIGV2ZW50LCB0aGlzLmxvY2FXb3JkU3BhY2luZyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZUZvbnRTaXplOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwYXNzLWZvbnQtc2l6ZScsIGV2ZW50LCB0aGlzLmxvY2FsRm9udFNpemUpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VGb250RmFtaWx5OiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwYXNzLWZvbnQtZmFtaWx5JywgZXZlbnQsIHRoaXMubG9jYWxGb250RmFtaWx5KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZmlsdGVyczoge30sXG4gICAgY29tcHV0ZWQ6IHt9LFxuICAgIHdhdGNoOiB7fSxcbn1cblxuIiwiLy8gR2xvYmFsIFJlZ2lzdHJhdGlvblxuVnVlLmNvbXBvbmVudCgnZ2xvYmFsLXNjcmlwdC1mb250LWZhbWlseScsIHtcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c2VsZWN0IGNsYXNzPVwic2NyaXB0LWNvbnRyb2xcIiBpZD1cInNjcmlwdC1jb250cm9sXCIgdi1tb2RlbD1cImZvbnRGYW1pbHlcIiBAY2hhbmdlPWNoYW5nZUZvbnRGYW1pbHkoKT5cbiAgICAgICAgICAgIDxvcHRncm91cCB2LWZvcj1cImZvbnRUeXBlIGluIE9iamVjdC5rZXlzKGZvbnRzKVwiIDpsYWJlbD1cImZvbnRUeXBlXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2LWZvcj1cImZvbnQgaW4gZm9udHNbZm9udFR5cGVdXCIgOnZhbHVlPVwiZm9udFwiPnt7Zm9udH19PC9vcHRpb24+XG4gICAgICAgICAgICA8L29wdGdyb3VwPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICBgLFxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0dhcmFtb25kJyxcbiAgICAgICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgICAgICAgJ3NlcmlmJzogW1xuICAgICAgICAgICAgICAgICAgICAnR2FyYW1vbmQnLFxuICAgICAgICAgICAgICAgICAgICAnR2VvcmdpYScsXG4gICAgICAgICAgICAgICAgICAgICdQYWxhdGlubycsXG4gICAgICAgICAgICAgICAgICAgICdUaW1lcyBOZXcgUm9tYW4nLFxuICAgICAgICAgICAgICAgICAgICAnVGltZXMnLFxuICAgICAgICAgICAgICAgICAgICAnQm9va21hbicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnc2Fucy1zZXJpZic6W1xuICAgICAgICAgICAgICAgICAgICAnQXJpYWwnLFxuICAgICAgICAgICAgICAgICAgICAnQXJpYWwgQmxhY2snLFxuICAgICAgICAgICAgICAgICAgICAnQ29taWMgU2FucyBNUycsXG4gICAgICAgICAgICAgICAgICAgICdJbXBhY3QnLFxuICAgICAgICAgICAgICAgICAgICAnTHVjaWRhIEdyYW5kZScsXG4gICAgICAgICAgICAgICAgICAgICdUYWhvbWEnLFxuICAgICAgICAgICAgICAgICAgICAnVHJlYnVjaGV0IE1TJyxcbiAgICAgICAgICAgICAgICAgICAgJ0hlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICAgICdWZXJkYW5hJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdtb25vc3BhY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgICdDb3VyaWVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ0NvdXJpZXIgTmV3J1xuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VGb250RmFtaWx5OiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZvbnRGYW1pbHkpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcnM6IHt9LFxuICAgIGNvbXB1dGVkOiB7fSxcbiAgICB3YXRjaDoge30sXG59KVxuXG4vLyBMb2NhbCBSZWdpc3RyYXRpb25cbi8vIOW/hemcgOWwh2NvbXBvbmVudOWvq+WcqHZ1ZSBpbnN0YW5jZeijoemdouOAgihzY2VuZS5qcylcbnZhciBzY3JpcHRGb250RmFtaWx5ID0ge1xuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJzY3JpcHQtZm9udC1mYW1pbHlcIiBpZD1cInNjcmlwdC1mb250LWZhbWlseVwiIHYtbW9kZWw9XCJsb2NhbEZvbnRGYW1pbHlcIiBAY2hhbmdlPWNoYW5nZUZvbnRGYW1pbHkoJGV2ZW50KT5cbiAgICAgICAgICAgIDxvcHRncm91cCB2LWZvcj1cImZvbnRUeXBlIGluIE9iamVjdC5rZXlzKGZvbnRzKVwiIDpsYWJlbD1cImZvbnRUeXBlXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2LWZvcj1cImZvbnQgaW4gZm9udHNbZm9udFR5cGVdXCIgOnZhbHVlPVwiZm9udFwiPnt7Zm9udH19PC9vcHRpb24+XG4gICAgICAgICAgICA8L29wdGdyb3VwPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICBgLFxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9jYWxGb250RmFtaWx5OiAnVGltZXMgTmV3IFJvbWFuJyxcbiAgICAgICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgICAgICAgJ3NlcmlmJzogW1xuICAgICAgICAgICAgICAgICAgICAnR2FyYW1vbmQnLFxuICAgICAgICAgICAgICAgICAgICAnR2VvcmdpYScsXG4gICAgICAgICAgICAgICAgICAgICdQYWxhdGlubycsXG4gICAgICAgICAgICAgICAgICAgICdUaW1lcyBOZXcgUm9tYW4nLFxuICAgICAgICAgICAgICAgICAgICAnVGltZXMnLFxuICAgICAgICAgICAgICAgICAgICAnQm9va21hbicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnc2Fucy1zZXJpZic6W1xuICAgICAgICAgICAgICAgICAgICAnQXJpYWwnLFxuICAgICAgICAgICAgICAgICAgICAnQXJpYWwgQmxhY2snLFxuICAgICAgICAgICAgICAgICAgICAnQ29taWMgU2FucyBNUycsXG4gICAgICAgICAgICAgICAgICAgICdJbXBhY3QnLFxuICAgICAgICAgICAgICAgICAgICAnTHVjaWRhIEdyYW5kZScsXG4gICAgICAgICAgICAgICAgICAgICdUYWhvbWEnLFxuICAgICAgICAgICAgICAgICAgICAnVHJlYnVjaGV0IE1TJyxcbiAgICAgICAgICAgICAgICAgICAgJ0hlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICAgICdWZXJkYW5hJyxcbiAgICAgICAgICAgICAgICAgICAgJ01pY3Jvc29mdCBKaGVuZ0hlaSdcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdtb25vc3BhY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgICdDb3VyaWVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ0NvdXJpZXIgTmV3J1xuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjaGFuZ2VGb250RmFtaWx5OiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhldmVudClcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3Bhc3MtZm9udC1mYW1pbHknLCBldmVudCwgdGhpcy5sb2NhbEZvbnRGYW1pbHkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXJzOiB7fSxcbiAgICBjb21wdXRlZDoge30sXG4gICAgd2F0Y2g6IHt9LFxufVxuXG4iLCIvLyBMb2NhbCBSZWdpc3RyYXRpb25cbi8vIOW/hemcgOWwh2NvbXBvbmVudOWvq+WcqHZ1ZSBpbnN0YW5jZeijoemdouOAgihzY2VuZS5qcylcbnZhciBzY3JpcHRDb250cm9sU2Nyb2xsID0ge1xuICAgIHByb3BzOiBbXG4gICAgICAgICdyb3RhdGVaJ1xuICAgIF0sXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbD5BdXRvIFNjcm9sbGluZyBTcGVlZDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJzY3JpcHQtc2Nyb2xsLXNwZWVkXCIgdi1tb2RlbD1cImxvY2FsU2Nyb2xsU3BlZWRcIiBAY2hhbmdlPWNoYW5nZVNjcm9sbFNwZWVkKCRldmVudCkgdHlwZT1cIm51bWJlclwiPlxuICAgICAgICAgICAgPGxhYmVsPkF1dG8gU2Nyb2xsOjwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uIEBjbGljaz1cImF1dG9TY3JvbGxcIj5BdXRvIFNjcm9sbCBTdGFydDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBAY2xpY2s9XCJjbGllbnRBdXRvU2Nyb2xsXCI+Q2xpZW50IEF1dG8gU2Nyb2xsPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2NhbFNjcm9sbFNwZWVkOiAzMFxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGNoYW5nZVNjcm9sbFNwZWVkOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwYXNzLXNjcm9sbGluZy1zcGVlZCcsIGV2ZW50LCB0aGlzLmxvY2FsU2Nyb2xsU3BlZWQpO1xuICAgICAgICB9LFxuICAgICAgICBhdXRvU2Nyb2xsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJldmlvdXNTY3JvbGxUb3AgPSAwXG4gICAgICAgICAgICB2YXIgc2Nyb2xsRGVsYXkgPSBudWxsXG4gICAgICAgICAgICB2YXIgcm90YXRlWiA9IHRoaXMucm90YXRlWlxuICAgICAgICAgICAgZnVuY3Rpb24gcGFnZVNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsVGFyZ2V0ID0gJCgnLnNjcmlwdC1jb250ZW50JylcbiAgICAgICAgICAgICAgICBpZiAocm90YXRlWiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRhcmdldC5hbmltYXRlKHtzY3JvbGxUb3A6IFwiKz0xcHhcIiB9LCAwLCAnbGluZWFyJywgZnVuY3Rpb24oKXsgc2Nyb2xsVGFyZ2V0LmNsZWFyUXVldWUoKTsgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVGFyZ2V0LmFuaW1hdGUoe3Njcm9sbFRvcDogXCItPTFweFwiIH0sIDAsICdsaW5lYXInLCBmdW5jdGlvbigpeyBzY3JvbGxUYXJnZXQuY2xlYXJRdWV1ZSgpOyB9KTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChzY3JvbGxEZWxheSk7XG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsYXkgPSBzZXRUaW1lb3V0KHBhZ2VTY3JvbGwsIHRoaXMubG9jYWxTY3JvbGxTcGVlZCk7XG5cbiAgICAgICAgICAgICAgICBpZihwcmV2aW91c1Njcm9sbFRvcCAtIHBhcnNlSW50KHNjcm9sbFRhcmdldC5zY3JvbGxUb3AoKSkgPiAyICl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGVhclRpbWVvdXQnKVxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsRGVsYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91c1Njcm9sbFRvcCA9IHBhcnNlSW50KHNjcm9sbFRhcmdldC5zY3JvbGxUb3AoKSlcblxuICAgICAgICAgICAgICAgIGlmKHNjcm9sbFRhcmdldC5zY3JvbGxUb3AoKSA+PSAoICggc2Nyb2xsVGFyZ2V0WzBdLnNjcm9sbEhlaWdodCAtIHNjcm9sbFRhcmdldC5oZWlnaHQoKSApKSl7XG4gICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsRGVsYXkpO1xuICAgICAgICAgICAgICAgICAgLy8gYmFjayB0byB0b3BcbiAgICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgIC8vICAgJCgnLnNjcmlwdC1jb250ZW50Jykuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDUwMCwgJ3N3aW5nJywgZnVuY3Rpb24oKXsgJCgnLnNjcmlwdC1jb250ZW50JykuY2xlYXJRdWV1ZSgpOyB9KTtcbiAgICAgICAgICAgICAgICAgIC8vIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFnZVNjcm9sbCgpXG4gICAgICAgIH0sXG4gICAgICAgIGNsaWVudEF1dG9TY3JvbGw6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgncGFzcy1jbGllbnQtYXV0by1zY3JvbGwnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZmlsdGVyczoge30sXG4gICAgY29tcHV0ZWQ6IHt9LFxuICAgIHdhdGNoOiB7fSxcbn1cblxuIiwidmFyIHNjZW5lID0gbmV3IFZ1ZSh7XG4gICAgZWw6ICcjc2NlbmUnLFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3NjcmlwdC1jb250ZW50Jzogc2NyaXB0Q29udGVudCxcbiAgICAgICAgJ3NjcmlwdC1mb250LWZhbWlseSc6IHNjcmlwdEZvbnRGYW1pbHksXG4gICAgICAgICdzY3JpcHQtY29udHJvbC1mb250Jzogc2NyaXB0Q29udHJvbEZvbnQsXG4gICAgICAgICdzY3JpcHQtY29udHJvbC1zY3JvbGwnOiBzY3JpcHRDb250cm9sU2Nyb2xsLFxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBpc01vYmlsZTogZmFsc2UsXG4gICAgICAgIGRldmljZVR5cGU6ICdob3N0JyxcbiAgICAgICAgc2NlbmVGb250RmFtaWx5OiAnbW9ub3NwYWNlJyxcbiAgICAgICAgc2NlbmVGb250U2l6ZTogJzM2JyxcbiAgICAgICAgcm90YXRlWTogMCxcbiAgICAgICAgcm90YXRlWjogMCxcbiAgICAgICAgc2NlbmVDb250ZW50V2lkdGg6IDU3NixcbiAgICAgICAgc2NlbmVDb250ZW50SGVpZ2h0OiAzNjAsXG4gICAgICAgIHNjZW5lTGV0dGVyU3BhY2luZzogMCxcbiAgICAgICAgc2NlbmVXb3JkU3BhY2luZzogMCxcbiAgICAgICAgc2NlbmVTY3JvbGxUbzogMCxcbiAgICAgICAgc2NlbmVTY3JvbGxTcGVlZDogMTAwLFxuICAgICAgICBzY2VuZVNjcmlwdEhlaWdodDogMzYwLFxuICAgICAgICBzeW5jU2Nyb2xsOiBmYWxzZSxcbiAgICAgICAgc2NlbmVDb250ZW50OiAnJyxcbiAgICAgICAgc29ja2V0OiBudWxsLFxuICAgICAgICByb29tSWQ6ICcnXG4gICAgfSxcbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLnNlYXJjaCgnbW9iaWxlJyk7XG4gICAgICAgIHRoaXMuaXNNb2JpbGUgPSBzZWFyY2hSZXN1bHQgPiAtMTtcbiAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLmRldmljZVR5cGUgPSAnaG9zdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRldmljZVR5cGUgPSAnY2xpZW50JztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDb2RlIHRoYXQgd2lsbCBydW4gb25seSBhZnRlciB0aGVcbiAgICAgICAgICAgIC8vIGVudGlyZSB2aWV3IGhhcyBiZWVuIHJlbmRlcmVkXG4gICAgICAgICAgICBpZiAodGhpcy5kZXZpY2VUeXBlID09ICdjbGllbnQnKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMuam9pblJvb20oKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBjcmVhdGVSb29tOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGUgcm9vbScpXG4gICAgICAgICAgICB0aGlzLnNvY2tldCA9IGlvKHt9KVxuXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb24gY29ubmVjdDogJywgdGhpcy5zb2NrZXQuaWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhvc3RJbmZvID0ge3R5cGU6J2hvc3QnLCB1cmw6IGRvY3VtZW50LlVSTH1cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2NyZWF0ZVJvb20nLCBob3N0SW5mbywgKHJvb21JZCwgc3ZnU3RyKSA9PiB7XG4gICAgICAgICAgICAvLyB0aGlzLnNvY2tldC5lbWl0KCdjcmVhdGVSb29tJywgJ2hvc3QnLCAocm9vbUlkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jvb20gaWQ6ICcsIHJvb21JZCk7XG4gICAgICAgICAgICAgICAgJCgnLnN2ZycpLmFwcGVuZChzdmdTdHIpXG4gICAgICAgICAgICAgICAgJCgnLmNsaWVudC11cmw+YScpLmF0dHIoJ3VybCcsIGRvY3VtZW50LlVSTCsnP3I9Jytyb29tSWQpXG4gICAgICAgICAgICAgICAgJCgnLmNsaWVudC11cmw+YScpLnRleHQoZG9jdW1lbnQuVVJMKyc/cj0nK3Jvb21JZClcblxuICAgICAgICAgICAgICAgIHRoaXMucm9vbUlkID0gcm9vbUlkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uKCdjbGllbnQgbXNnJywgKG1zZyk9PntcbiAgICAgICAgICAgICAgICBsZXQgbXNnT2JqID0gSlNPTi5wYXJzZShtc2cpO1xuICAgICAgICAgICAgICAgIHN3aXRjaChtc2dPYmouY21kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Jlc2l6ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZVNjcmlwdENvbnRlbnQoe3dpZHRoOiBtc2dPYmpbJ3dpZHRoJ10sIGhlaWdodDogbXNnT2JqWydoZWlnaHQnXX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlcXVpcmVDb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZVNjcmlwdENvbnRlbnQobnVsbCwgc2VsZi4kcmVmcy5zY3JpcHRDb250ZW50LmNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVTY3JpcHRDb250ZW50SGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgam9pblJvb206IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3BsaXQoXCI/XCIpLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyh7fSlcbiAgICAgICAgICAgIGxldCBnZXRQYXJhbXMgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNwbGl0KFwiP1wiKVsxXS5zcGxpdCgnJicpXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdldFBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChcInJcIiA9PSBnZXRQYXJhbXNbaV0uc3BsaXQoXCI9XCIpWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vbUlkID0gZ2V0UGFyYW1zW2ldLnNwbGl0KFwiPVwiKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jvb20gaWQ6ICcsIHRoaXMucm9vbUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb24gY29ubmVjdDogJywgdGhpcy5zb2NrZXQuaWQpO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICByb29taWQ6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICBjbWQ6ICdyZXF1aXJlQ29udGVudCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnY2xpZW50IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGRldmljZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgZGV2aWNlVHlwZTogJ2NsaWVudCcsXG4gICAgICAgICAgICAgICAgcm9vbUlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnJvb21JZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pblJvb20nLCBKU09OLnN0cmluZ2lmeShkZXZpY2VJbmZvKSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGhpcy5zb2NrZXQub24oJ2hvc3QgbXNnJywgKG1zZyk9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwKCdob3N0IG1zZycpO1xuICAgICAgICAgICAgICAgIGxldCBtc2dPYmogPSBKU09OLnBhcnNlKG1zZyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnT2JqKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2gobXNnT2JqLmNtZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1cGRhdGVDb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmVDb250ZW50ID0gbXNnT2JqWyd2YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZvbnRGYW1pbHknOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZUZvbnRGYW1pbHkgPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZm9udFNpemUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZUZvbnRTaXplID0gbXNnT2JqWyd2YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xldHRlclNwYWNpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZUxldHRlclNwYWNpbmcgPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnd29yZFNwYWNpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZVdvcmRTcGFjaW5nID0gbXNnT2JqWyd2YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZvbnRDb2xvcic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lRm9udENvbG9yID0gbXNnT2JqWyd2YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JnQ29sb3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZUJnQ29sb3IgPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2NyaXB0SGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmVTY3JpcHRIZWlnaHQgPSBtc2dPYmpbJ3ZhbHVlJ10gKyA3MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzY3JvbGxUbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lU2Nyb2xsVG8gID0gbXNnT2JqWyd2YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Njcm9sbGluZ1NwZWVkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmVTY3JvbGxTcGVlZCAgPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncm90YXRlWSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVkgPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncm90YXRlWic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVogPSBtc2dPYmpbJ3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2xpZW50QXV0b1Njcm9sbCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLnNjcm9sbENvbnRyb2wuYXV0b1Njcm9sbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgnaG9zdCBtc2cnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTeW5jU2Nyb2xsOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuZ2Ugc3luY1Njcm9sbCB0byA6ICcsICF0aGlzLnN5bmNTY3JvbGwpXG4gICAgICAgICAgICB0aGlzLnN5bmNTY3JvbGwgPSAhdGhpcy5zeW5jU2Nyb2xsXG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVNjcmlwdENvbnRlbnQ6IGZ1bmN0aW9uIChldmVudCwgY2hpbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICByb29taWQ6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgIGNtZDogJ3VwZGF0ZUNvbnRlbnQnLCBcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2hpbGRWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnaG9zdCBtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JpcHRDb250ZW50SGVpZ2h0KClcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlU2NyaXB0Q29udGVudEhlaWdodDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICBpZiAodGhpcy5yb29tSWQubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAgICAgICAgIGxldCB0ZXh0YXJlYURhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdzY3JpcHRIZWlnaHQnLCBcbiAgICAgICAgICAgICAgICB2YWx1ZTogJCgndGV4dGFyZWEnKS5pbm5lckhlaWdodCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdob3N0IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeSh0ZXh0YXJlYURhdGEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZXNpemU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdyZXNpemUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmVDb250ZW50V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICAgICAgdGhpcy5zY2VuZUNvbnRlbnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2NsaWVudCBtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9LFxuICAgICAgICByZXNpemVTY3JpcHRDb250ZW50OiBmdW5jdGlvbiAoY29udGVudERvbVNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmVDb250ZW50V2lkdGggPSBjb250ZW50RG9tU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmVDb250ZW50SGVpZ2h0ID0gY29udGVudERvbVNpemUuaGVpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VGb250RmFtaWx5OiBmdW5jdGlvbiAoZXZlbnQsIGNoaWxkVmFsdWUpe1xuICAgICAgICAgICAgdGhpcy5zY2VuZUZvbnRGYW1pbHkgPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdmb250RmFtaWx5JywgXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNoaWxkVmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdob3N0IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZUZvbnRTaXplOiBmdW5jdGlvbiAoZXZlbnQsIGNoaWxkVmFsdWUpe1xuICAgICAgICAgICAgdGhpcy5zY2VuZUZvbnRTaXplID0gY2hpbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvb21JZCA9PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHJvb21pZDogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgY21kOiAnZm9udFNpemUnLCBcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2hpbGRWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnaG9zdCBtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VMZXR0ZXJTcGFjaW5nOiBmdW5jdGlvbiAoZXZlbnQsIGNoaWxkVmFsdWUpe1xuICAgICAgICAgICAgdGhpcy5zY2VuZUxldHRlclNwYWNpbmcgPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdsZXR0ZXJTcGFjaW5nJywgXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNoaWxkVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2hvc3QgbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlV29yZFNwYWNpbmc6IGZ1bmN0aW9uIChldmVudCwgY2hpbGRWYWx1ZSl7XG4gICAgICAgICAgICB0aGlzLnNjZW5lV29yZFNwYWNpbmcgPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICd3b3JkU3BhY2luZycsIFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjaGlsZFZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdob3N0IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZUZvbnRDb2xvcjogZnVuY3Rpb24gKGV2ZW50LCBjaGlsZFZhbHVlKXtcbiAgICAgICAgICAgIHRoaXMuc2NlbmVGb250Q29sb3IgPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdmb250Q29sb3InLCBcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2hpbGRWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnaG9zdCBtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VCZ0NvbG9yOiBmdW5jdGlvbiAoZXZlbnQsIGNoaWxkVmFsdWUpe1xuICAgICAgICAgICAgdGhpcy5zY2VuZUJnQ29sb3IgPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdiZ0NvbG9yJywgXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNoaWxkVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2hvc3QgbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlU2Nyb2xsVG86IGZ1bmN0aW9uIChldmVudCwgY2hpbGRWYWx1ZSl7XG4gICAgICAgICAgICAvLyBUT0RPIGNvbW1lbnQgdGhpcyBmb3IgZGV2XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3luY1Njcm9sbCkgcmV0dXJuXG4gICAgICAgICAgICB0aGlzLnNjZW5lU2Nyb2xsVG8gPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdzY3JvbGxUbycsIFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjaGlsZFZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdob3N0IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZVNjcm9sbGluZ1NwZWVkOiBmdW5jdGlvbiAoZXZlbnQsIGNoaWxkVmFsdWUpe1xuICAgICAgICAgICAgdGhpcy5zY2VuZVNjcm9sbFNwZWVkID0gcGFyc2VJbnQoY2hpbGRWYWx1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5yb29tSWQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICByb29taWQ6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgIGNtZDogJ3Njcm9sbGluZ1NwZWVkJywgXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNoaWxkVmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdob3N0IG1lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsaWVudEF1dG9TY3JvbGw6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdjbGllbnRBdXRvU2Nyb2xsJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2hvc3QgbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmxpcFk6IGZ1bmN0aW9uIChldmVudCwgZGVncmVlKSB7XG4gICAgICAgICAgICBpZiAoZGVncmVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVkgPSBkZWdyZWUgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yb3RhdGVZID09IDE4MCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGVZID0gMTgwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnJvb21JZCA9PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHJvb21pZDogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgY21kOiAncm90YXRlWScsIFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnJvdGF0ZVlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQpIHRoaXMuc29ja2V0LmVtaXQoJ2hvc3QgbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmxpcFo6IGZ1bmN0aW9uIChldmVudCwgZGVncmVlKSB7XG4gICAgICAgICAgICBpZiAoZGVncmVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVogPSBkZWdyZWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0ZVogPT0gMTgwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm90YXRlWiA9IDA7XG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdGF0ZVogPSAxODA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucm9vbUlkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm9vbWlkOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICBjbWQ6ICdyb3RhdGVaJywgXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucm90YXRlWlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldCkgdGhpcy5zb2NrZXQuZW1pdCgnaG9zdCBtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZmlsdGVyczoge30sXG4gICAgY29tcHV0ZWQ6IHt9LFxuICAgIHdhdGNoOiB7fSxcbn0pXG5cblxuIl19
