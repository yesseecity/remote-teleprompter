// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptControlFont = {
    template: `
        <div>
            <label>Font Size</label>
            <input class="script-font-size" v-model="localFontSize" @change=changeFontSize($event) type="number">
        </div>
    `,
    data: function() {
        return {
            localFontSize: 18,
        }
    },
    methods: {
        changeFontSize: function(event){
            // console.log(event)
            this.$emit('pass-font-size', event, this.localFontSize);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}

