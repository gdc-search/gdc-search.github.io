/**
 * 这个文件定义了左侧悬停分类目录的组件
 */

/**
* 跳转链接组件
*/
const uiCompCategoryMenu = Vue.extend({
    template: '#ui-comp-template-category-menu',
    props: {
        year: Number,
        category: String,
        enableSameCategory: Boolean,
        fixedHeight: Boolean
    }
});

/**
* 分类目录集成组件
*/
const uiCompCategoryMenuList = Vue.extend({
    template: '#ui-comp-template-category-menu-list',
    props: {
        showRelated: Boolean,
        enableSameCategory: Boolean,
        year: Number,
        category: String
    },
    components: {
        "category-menu": uiCompCategoryMenu
    },
    computed: {
        //只是测试一下用法
        yearDesc: function () { return getDescOrderYears() }
    }
});