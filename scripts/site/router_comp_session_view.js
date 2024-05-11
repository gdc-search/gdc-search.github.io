const routerCompSessionView = Vue.extend({
    template: '#router-comp-template-session-view',
    props: {
        year: String,
        category: String,
        sessionId: Number
    },
    methods: {
        sessionItem: function (year, category, sessionId) {
            var list = globalSettings.dataSources[year][category];
            for (const item of list) {
                if (getSessionItemId(item) == sessionId)
                    return item;
            }
            rootUrl = composeSessionListUrl(year, category);
            this.$root.navigate(rootUrl)
            return list[0];
        }
    },
    components: {
        "category-menu": uiCompCategoryMenuList,
        "session-view": uiCompSessionView
    }
});