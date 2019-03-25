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
        <div class="script-content" 
            v-bind:style="contentStyle" 
            v-on:scroll='onScroll'
            >
            <textarea 
                v-if="isMobile"
                v-bind:style="textareaStyle" 
                v-bind:class="dymainicClass" 
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
            content: `美國股市周一盤中狹幅震盪，全球經濟成長減速的恐懼持續籠罩市場，道瓊工業指數小漲19.43點或0.08%至25521.75點，S&P 500指數漲0.01%至2800.97點，納斯達克指數小跌0.03%至7640.49點。費城半導體指數周一盤中重挫，跌1.37%至1381.16點。

蘋果股價周一盤中最多跌1.99%，報187.25美元。蘋果周一舉行發表會，市場普遍預期蘋果將發表影音串流服務。

美國3個月期公債殖利率上周五超越10年期公債，形成殖利率曲線反轉，是逾10年來首見，投資人把殖利率曲線反轉視為經濟可能即將陷入衰退的跡象。歐洲上周五公布的經濟數據令人失望和美國聯準會（Fed）調降經濟展望，進一步推升投資人憂慮。

BAIRD公司首席投資策略師畢托斯（Bruce Bittles）說：「歐洲和中國經濟持續惡化使投資人感到不安，他們擔心海外問題可能影響美國市場。跡象顯示美國經濟不像去年那麼強健，去年第3和第4季資本支出下滑是跡象之一。」（林文彬／綜合外電報導）`,
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
            if (this.content.length == 0) {
                return
            }
            this.$emit('pass-script-content', event, this.content);
        },
        autoGrow:(event)=>{
            // textarea = 
            // var adjustedHeight=textarea.clientHeight;
            // adjustedHeight=Math.max(textarea.scrollHeight,adjustedHeight);
            // if (adjustedHeight>textarea.clientHeight){
            //     textarea.style.height=adjustedHeight+'px';
            // }

        },
        autoScroll: function () {
            scrollDelay = null
            previousScrollTop = null
            function pageScroll() {
                scrollTarget = $('.script-content')
                scrollTarget.animate({scrollTop: "+=1px" }, 0, 'linear', function(){ scrollTarget.clearQueue(); });

                clearTimeout(scrollDelay);
                scrollDelay = setTimeout(pageScroll, this.scrollingSpeed);

                if(previousScrollTop+1 !== parseInt(scrollTarget.scrollTop())){
                    clearTimeout(scrollDelay);
                }

                previousScrollTop = parseInt(scrollTarget.scrollTop())
                // We're at the bottom of the document, stop
                if(scrollTarget.scrollTop() >= ( ( scrollTarget[0].scrollHeight - $(window).height() ) - 100 )){
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
        onScroll: function (event) {
            // console.log('onScroll', event)
            console.log('scrollTop: ', this.$el.scrollTop)
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
        contentStyle: function () {
            let defaultStyle = {}

            if (this.contentWidth !== 0) {
                defaultStyle['width'] = this.contentWidth + 'px'
            }
            if (this.contentHeight !== 0) {
                defaultStyle['height'] = this.contentHeight + 'px'
            }
            return defaultStyle
        },
        textareaStyle: function () {
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
            // if (this.contentHeight !== 0) {
            //     defaultStyle['height'] = this.contentHeight + 'px'
            // }
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


