const routerCompSessionListView = Vue.extend({

    template: '#router-component-template-session-list-view',
    props: {
        year: String,
        category: String
    },
    components: {
        "category-menu": uiCompCategoryMenuList,
        "session-list": uiCompSessionList
    },
    computed: {
        title: function () {
            return globalSettings.categories[this.category].full + ' 20' + this.year
        },
        dataSource: function () {
            return globalSettings.dataSources[this.year][this.category];
        }
    }
});