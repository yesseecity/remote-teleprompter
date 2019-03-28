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
            <input id="script-control-font-size" class="font-size" v-model="localFontSize" @change=changeFontSize($event) type="number">
            <label for="script-control-letter-spacing">Letter spacing</label>
            <input id="script-control-letter-spacing" 
                   class="letter-spacing" 
                   type="number" 
                   min="0" 
                   max="10" 
                   v-model="locaLetterSpacing"
                   @change=changeLetterSpacing($event)
                   >
            <label for="script-control-word-spacing">Word spacing</label>
            <input id="script-control-word-spacing" 
                   class="word-spacing" 
                   type="number" 
                   min="0" 
                   max="10" 
                   v-model="locaWordSpacing"
                   @change=changeWordSpacing($event)
                   >
        </div>
    `,
    data: function() {
        return {
            localFontSize: 48,
            localFontFamily: 'monospace',
            locaLetterSpacing: 0,
            locaWordSpacing: 0,
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
                    'Courier New',
                    'MS Gothic',
                    'MS PGothic',
                    'MS UI Gothic',
                    'MS Mincho',
                    'MS PMincho',
                    'NSimSun',
                    'SimSun',

                ]
            }
        }
    },
    methods: {
        changeLetterSpacing: function (event) {
            this.$emit('pass-letter-spacing', event, this.locaLetterSpacing);
        },
        changeWordSpacing: function (event) {
            this.$emit('pass-word-spacing', event, this.locaWordSpacing);
        },
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

