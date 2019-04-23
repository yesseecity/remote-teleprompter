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
                v-on:keyup='autoGrow'
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
        // this.autoGrow()
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
        autoGrow: function (event) {
            textarea = event.target
            cssLineHeight = $(textarea).css('line-height')

            var lineHeight = 0;
            if (cssLineHeight == 'normal') {
                fontSize = $(textarea).css('font-size').slice(0,2)
                lineHeight = parseInt(fontSize*1.46, 10);
            } else {
                lineHeight = parseInt(cssLineHeight, 10);
            }
            var lines = textarea.value.split('\n');
            var columns = textarea.cols/2;
            var lineCount = 0;
            console.log('columns: ', columns)
            lines.forEach(function(line) {
                lineCount += Math.ceil(line.length / columns) || 1;              
            });

            var height = lineHeight * (lineCount + 1);
            $(textarea).css('height', height);
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
            console.log(!this.isMobile)
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
            if (this.isMobile && this.contentScriptHeight !== 0) {
                cssStyle['height'] = this.contentScriptHeight + 'px'
            }
            if (!this.isMobile) {
                cssStyle['min-height'] = this.contentScriptHeight + 'px'
            } else {
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


