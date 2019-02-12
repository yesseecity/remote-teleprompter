// Local Registration
var scriptContent = {
    props: {
        'fontFamily': String,
    },
    template: `
         <textarea class="script-content" v-bind:style="dymanicStyle" v-model="contents"></textarea>
    `,
    data: function() {
        return {
            contents: "tagName：元件的tag名稱，可以在HTML中被拿來當標籤使用，所以須保有唯一性，不能與其他全域元件的名稱重複。 \noptions：選擇性參數，可將前面所學到的options屬性(data、methods、filters、computed、watch)放進去使用，注意data只能是function型態，如果沒有使用function，Vue將會停止執行。",
        }
    },
    methods: {},
    filters: {},
    computed: {
        dymanicStyle: function () {
            return {
                fontFamily: this.fontFamily,
            }
        }
    },
    watch: {},
}


