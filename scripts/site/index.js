Vue.use(VueRouter);

const rootComponent = {

    //路由挂接
    router: rootRouter,

    //启动的时候跳转到正确的路由上
    mounted: function () {
        var currPath = this.$router.currentRoute.path;
        if (currPath == '/') this.navigateToDefault();
    },

    data: {
        searchResult: [],
        isSearching: false,
        showCategoryMenu: true
    },
    components: {
        "search-box": uiCompSearchBox
    },
    computed: {
        searchResultSource: function () {
            return this.searchResult;
        }
    },
    //提供给网站的集成功能
    methods: {
        navigateToDefault: function () {
            this.navigateTo(globalSettings.current.year, globalSettings.current.category);
        },
        navigateTo: function (year, category) {
            this.navigate(composeSessionListUrl(year, category));
        },
        navigate: function (destPath) {
            var currPath = this.$router.currentRoute.path;
            if (currPath != destPath) this.$router.push({ path: destPath });
        },
        displaySearchResult: function (result) {
            this.searchResult = result;
            this.isSearching = true;
            this.navigate('/search');
        },
        clearSearchView: function () {
            this.searchResult = [];
            this.isSearching = false;
            this.navigateToDefault();
        }
    }
}

const Application = new Vue(rootComponent).$mount('#container')