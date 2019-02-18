// Local Registration
var scriptContent = {
    props: ['fontFamily', 'fontSize', 'isMobile'],
    template: `
         <textarea class="script-content" 
         v-bind:style="dymanicStyle" 
         v-bind:class="dymainicClass" 
         v-bind:readonly="isMobile"
         v-on:click='doubletap'
         v-model="contents" 
         ></textarea>
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
        reflex: function() {
            // 'horizontal'
            // 'vertical'
            
        },
        autoScroll: function () {
            
        },
        scrollTo: function (position) {
            this.$el.scrollTop = position
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
            }
            return defaultStyle
        },
        dymainicClass: function () {
            if (this.isMobile) {
                return 'mobile-view'
            } else {
                return ''
            }
        }
    },
    watch: {},
}


