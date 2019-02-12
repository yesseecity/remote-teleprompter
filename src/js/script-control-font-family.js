// Global Registration
Vue.component('global-script-font-family', {
    template: `
        <select class="script-control" id="script-control" v-model="fontFamily" @change=changeFontFamily()>
            <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
            </optgroup>
        </select>
    `,
    data: function() {
        return {
            fontFamily: 'Garamond',
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
                    'Courier',
                    'Courier New'
                ]
            }
        }
    },
    methods: {
        changeFontFamily: function(event){
            console.log(this.fontFamily)
        }
    },
    filters: {},
    computed: {},
    watch: {},
})

// Local Registration
// 必需將component寫在vue instance裡面。(scene.js)
var scriptFontFamily = {
    template: `
        <select class="script-control" id="script-control" v-model="localFontFamily" @change=changeFontFamily()>
            <optgroup v-for="fontType in Object.keys(fonts)" :label="fontType">
                <option v-for="font in fonts[fontType]" :value="font">{{font}}</option>
            </optgroup>
        </select>
    `,
    data: function() {
        return {
            localFontFamily: 'Garamond',
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
                    'Courier',
                    'Courier New'
                ]
            }
        }
    },
    methods: {
        changeFontFamily: function(){
            this.$emit('pass-font-family', this.localFontFamily);
        }
    },
    filters: {},
    computed: {},
    watch: {},
}

