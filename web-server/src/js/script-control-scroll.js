// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptControlScroll = {
    template: `
        <div>
            <label>Auto Scrolling Speed</label>
            <input class="script-scroll-speed" v-model="localScrollSpeed" @change=changeScrollSpeed($event) type="number">
        </div>
    `,
    data: function() {
        return {
            localScrollSpeed: 100,
        }
    },
    methods: {
        changeScrollSpeed: function(event){
            this.$emit('pass-scrolling-speed', event, this.localScrollSpeed);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}

