const uiCompSessionVideoComment = Vue.extend({
	template: "#ui-comp-template-session-video-comment",
	props: {
		sessionItem: Object
	},
	computed: {
		commentURL: function () {
			const url = 'http://fake-gdc-vault-internal.url/'
				+ this.sessionItem.year + '/'
				+ this.sessionItem.shortcat + '/'
				+ this.sessionItem.vid;
			return url;
		}

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






