const rootRouter = new VueRouter({

    mode: "hash",

    // 当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法
    // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
    scrollBehavior(to, from, savedPosition) {
        //if(savedPosition) return savedPosition;
        const position = { x: 0, y: 0 };
        return position;
    },

    //
    routes: [

        //视频列表页面
        {
            path: '/:year/:category',
            component: routerCompSessionListView,
            props: true
        },

        // 视频详情页面
        {
            path: '/:year/:category/:sessionId',
            component: routerCompSessionView,
            props: true
        },

        //查找结果页面
        {
            path: '/search',
            component: routerCompSearchResultView,
            props: true
        }
    ]
});