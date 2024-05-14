const uiCompSessionVideoComment = Vue.extend({
	template: "#ui-comp-template-session-video-comment",
	props: {
		sessionItem: Object
	},
	computed: {
		commentURL: function () {
			const url = 'https://gdc-search.github.io/'
				+ this.sessionItem.year + '/'
				+ this.sessionItem.shortcat + '/'
				+ this.sessionItem.vid;
			return url;
		}

	},
	mounted: function() {
		document.title = this.sessionItem.title;
		let b = document.createElement('script');
		b.setAttribute('data-repo', "gdc-search/gdc-search.github.io");
		b.setAttribute('data-repo-id', "R_kgDOL6GVLg");
		b.setAttribute('data-category', "General");
		b.setAttribute('data-category-id', "DIC_kwDOL6GVLs4CfSZS");
		b.setAttribute('data-mapping', "title");
		b.setAttribute('data-strict', "0");
		b.setAttribute('data-reactions-enabled', "1");
		b.setAttribute('data-emit-metadata', "0");
		b.setAttribute('data-input-position', "top");
		b.setAttribute('data-theme', "light");
		b.setAttribute('data-lang', "en");
		b.setAttribute('data-loading', "lazy");
		b.async = true;
		b.src = 'https://giscus.app/client.js';
		b.crossorigin = "anonymous";
		document.getElementsByClassName('remote_comments_panel')[0].appendChild(b)
		
	}
});

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
		"video-desc-panel": uiCompVideoDescriptionPanel,
		"session-video-comment": uiCompSessionVideoComment
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