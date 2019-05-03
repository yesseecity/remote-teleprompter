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


