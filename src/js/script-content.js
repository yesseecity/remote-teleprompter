// Local Registration
var scriptContent = {
    props: ['fontFamily', 'fontSize'],
    template: `
         <textarea class="script-content" v-bind:style="dymanicStyle" v-model="contents" autofocus></textarea>
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
        }
    },
    methods: {},
    filters: {},
    computed: {
        dymanicStyle: function () {
            return {
                fontFamily: this.fontFamily,
                fontSize: this.fontSize +'px',
            }
        }
    },
    watch: {},
}


