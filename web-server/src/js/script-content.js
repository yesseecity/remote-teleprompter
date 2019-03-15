// Local Registration
var scriptContent = {
    props: [
        'contentWidth',
        'contentHeight',
        'contentLetterSpacing',
        'contentWordSpacing',
        'fontFamily',
        'fontSize',
        'isMobile',
        'rotateY',
        'rotateZ',
        'sceneContent',
    ],
    template: `
        <div class="script-content">
            <textarea 
                v-if="isMobile"
                v-bind:style="dymanicStyle" 
                v-bind:class="dymainicClass" 
                v-bind:readonly="isMobile"
                v-on:click='doubletap'
                v-model="sceneContent" 
            >

            </textarea>
            <textarea
                v-else
                v-bind:style="dymanicStyle" 
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
            content: '',
            mylatesttap: 0,
            inFullScreen: false,
            scrollingSpeed: 30,
        }
    },
    mounted: function () {
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
            this.$emit('pass-script-content', event, this.content);
        },
        autoScroll: function () {
            scrollDelay = null
            previousScrollTop = null
            function pageScroll() {
                $('.script-content').animate({scrollTop: "+=1px" }, 0, 'linear', function(){ $('.script-content').clearQueue(); });

                clearTimeout(scrollDelay);
                scrollDelay = setTimeout(pageScroll, this.scrollingSpeed);

                if(previousScrollTop+1 !== parseInt($(".script-content").scrollTop())){
                    clearTimeout(scrollDelay);
                }

                previousScrollTop = parseInt($(".script-content").scrollTop())
                // We're at the bottom of the document, stop
                if($(".script-content").scrollTop() >= ( ( $(".script-content")[0].scrollHeight - $(window).height() ) - 100 )){
                  // stop_teleprompter();
                  clearTimeout(scrollDelay);
                  // back to top
                  // setTimeout(function(){
                  //   $('.script-content').stop().animate({scrollTop: 0}, 500, 'swing', function(){ $('.script-content').clearQueue(); });
                  // }, 500);
                }
            }
            pageScroll()
        },
        scrollTo: function (position) {
            // this.$el.scrollTop = position
            this.$el.scrollBy({
              top: position,
              behavior: 'smooth'
            });
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
        dymanicStyle: function () {
            let defaultStyle = {
                fontFamily: this.fontFamily,
                fontSize: this.fontSize + 'px',
                transform: this.transform,
                letterSpacing: this.contentLetterSpacing + 'px',
                wordSpacing: this.contentWordSpacing + 'px'
            }
            if (this.contentWidth !== 0) {
                defaultStyle['width'] = this.contentWidth + 'px'
            }
            if (this.contentHeight !== 0) {
                defaultStyle['height'] = this.contentHeight + 'px'
            }
            return defaultStyle
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
    watch: {}
}


