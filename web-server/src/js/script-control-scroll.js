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

