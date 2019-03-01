// Local Registration
var scriptContent = {
    props: ['fontFamily', 'fontSize', 'isMobile', 'rotateY', 'rotateZ', 'newContent'],
    template: `
        <div class="script-content">
         <textarea 
         v-bind:style="dymanicStyle" 
         v-bind:class="dymainicClass" 
         v-bind:readonly="isMobile"
         v-on:click='doubletap'
         v-model="contents" 
         ></textarea>
        </div>
    `,
    data: function() {
        return {
            contents: `A winter storm pummeled the Hawaiian islands early Monday, bringing gusty winds, squally rain, high surf and even snow at a state park.

Strong winds knocked down trees and branches on roadways and structures and tore down traffic lights and power lines, causing power outages.
The winds could potentially damage roofs and poorly built structures, forecasters say. The powerful winds and a high surf closed some roads and parks.
Hiro Toiya, director of the Honolulu Department of Emergency Management, urged "extra caution driving."
"Conditions are windy and we do have trees and utility poles and other objects falling onto the street," he said
Hawaii Electric Light said that "due to unsafe weather conditions, crews will resume work when safe to do so. Mahalo for your patience."
`,
            mylatesttap: 0,
            inFullScreen: false,
            scrollingSpeed: 30,
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
                fontSize: this.fontSize +'px',
                transform: this.transform,
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
    watch: {},
}


