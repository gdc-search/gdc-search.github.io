Vue.use(VueRouter);

const rootComponent = {

    //路由挂接
    router: rootRouter,

    //启动的时候跳转到正确的路由上
    mounted: function () {
        var currPath = this.$router.currentRoute.path;
        if (currPath == '/') this.navigateToDefault();
        // 监听窗口大小变化
        this.isMobile = window.innerWidth <= 768; 
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.onScroll);
    },

    data: {
        searchResult: [],
        isSearching: false,
        showCategoryMenu: false,
        isMobile: false,
        windowScrollTop:0
    },
    components: {
        "search-box": uiCompSearchBox
    },
    computed: {
        searchResultSource: function () {
            return this.searchResult;
        }
    },
    watch: { 
        isMobile: {
            handler: function (newVal) {
                if (newVal) {
                    document.body.style.overflowX = "hidden"
                }else{
                    document.body.style.overflowX = "auto"
                }
            },
            deep: true
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
        },
        // 处理窗口大小变化的逻辑
        handleResize: function () {
            // 判断是否是移动端
            this.isMobile = window.innerWidth <= 768; 
        },
        onScroll:function () {
            this.windowScrollTop = window.scrollY; 
        }
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleResize);
    }
}

const Application = new Vue(rootComponent).$mount('#container')