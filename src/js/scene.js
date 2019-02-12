var scene = new Vue({
    el: '#scene',
    components: {
        'script-font-family': scriptFontFamily,
        'script-content': scriptContent
    },
    data: {
        name: 'Tid',
        sceneFontFamily: 'Garamond',
    },
    methods: {
        changeFontFamily: function(childValue){
            console.log('fontFamily: ', childValue)
        },
    },
    filters: {},
    computed: {},
    watch: {},
})


