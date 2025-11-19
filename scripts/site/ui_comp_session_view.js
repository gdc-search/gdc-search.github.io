const uiCompVideoDescriptionPanel = Vue.extend({
	template: "#ui-comp-template-video-desc-panel",
	props: {
		year: Number,
		category: Number,
		sessionItem: Object
	}
});


/**
 * 提供给路由的视频页面组件
 */
const uiCompSessionView = Vue.extend({
	template: "#ui-comp-template-session-view",
	props: {
		sessionItem: Object
	},
	components: {
		"local-video-player": uiCompLocalVideoPlayer,
		"remote-video-player": uiCompRemoteVideoPlayer,
		"video-desc-panel": uiCompVideoDescriptionPanel
	},
	methods: {
		popupSliderWindow: function (slider_url) {
			popupWindow = window.open(slider_url,
				'popUpWindow',
				'height=724,width=1284,left=0,top=0,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=yes'
			)
		},
		onBack: function(){
			history.back();
		}
	}
});




/*
<script src="https://giscus.app/client.js"
data-repo				="gdc-search/gdc-search.github.io"
data-repo-id			="R_kgDOL6GVLg"
data-category			="General"
data-category-id		="DIC_kwDOL6GVLs4CfSZS"
data-mapping			="url"
data-strict				="0"
data-reactions-enabled	="1"
data-emit-metadata		="0"
data-input-position		="top"
data-theme				="light"
data-lang				="zh-CN"
data-loading			="lazy"
crossorigin="anonymous"
async>
</script>
*/