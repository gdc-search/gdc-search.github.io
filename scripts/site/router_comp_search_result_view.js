const routerCompSearchResultView = Vue.extend({
    template: '#router-comp-template-search-result-view',
    components: {
        "category-menu": uiCompCategoryMenuList,
        "session-list": uiCompSessionList
    },
    mounted: function () {
        if (!this.$root.isSearching)
            history.back();
    },
});