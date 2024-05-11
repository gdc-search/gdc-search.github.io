/**
 * 这个文件定义了视频列表页面使用的组件
 */

/**
* 分类视频列表-跳转链接组件
*/
const uiCompSessionItem = Vue.extend({
    template: '#ui-comp-template-session-item',
    props: {
        showYear: Boolean,
        isSearchItem: Boolean,
        category: String,
        sessionItem: Object
    }
});

/**
 * 分类视频列表组件
 */
const uiCompSessionList = Vue.extend({
    template: "#ui-comp-template-session-list",
    props: {
        title: String,
        yearprefix: Boolean,
        isSearchItem: Boolean,
        dataSource: Object
    },
    components: {
        "session-item": uiCompSessionItem
    }
});
