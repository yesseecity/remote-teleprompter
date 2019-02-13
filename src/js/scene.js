var scene = new Vue({
    el: '#scene',
    components: {
        'script-content': scriptContent,
        'script-font-family': scriptFontFamily,
        'script-control-font': scriptControlFont,
        'script-control-scroll': scriptControlScroll,
    },
    data: {
        username: 'Tid',
        sceneFontFamily: 'Times New Roman',
        sceneFontSize: '18',
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
    methods: {
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
    },
    filters: {},
    computed: {},
    watch: {},
})


