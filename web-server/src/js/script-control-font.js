// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptControlFont = {
    template: `
        <div>
            <label for="script-control-font-family">Font family</label>
            <select class="script-control-font-family" id="script-control-font-family" v-model="localFontFamily" @change=changeFontFamily()>
                <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                    <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
                </optgroup>
            </select>
            <br>
            <label for="script-control-font-size">Font Size</label>
            <input id="script-control-font-size" class="script-control-font-size" v-model="localFontSize" @change=changeFontSize($event) type="number">
        </div>
    `,
    data: function() {
        return {
            localFontSize: 48,
            localFontFamily: 'monospace',
            fonts: {
                'serif': [
                    'Garamond',
                    'Georgia',
                    'Palatino',
                    'Times New Roman',
                    'Times',
                    'Bookman',
                ],
                'sans-serif':[
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Grande',
                    'Tahoma',
                    'Trebuchet MS',
                    'Helvetica',
                    'Verdana',
                ],
                'monospace': [
                    'monospace',
                    'Courier',
                    'Courier New'
                ]
            }
        }
    },
    methods: {
        changeFontSize: function(event){
            this.$emit('pass-font-size', event, this.localFontSize);
        },
        changeFontFamily: function(event){
            this.$emit('pass-font-family', event, this.localFontFamily);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}

