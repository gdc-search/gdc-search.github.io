/**
 * 这个源文件是组成视频查看页面的所有组件。
 * 视频播放组件会根据 index.js 的函数来自动切换，正常情况下只需要其中一个。
 */

/**
* 本地视频播放器组件，主要是封装了 video
*/
const uiCompLocalVideoPlayer = Vue.extend({
    template: "#ui-comp-template-local-video-player",
    props: {
        sessionVideoURL: String,
        sessionSubtitleURL: String
    }
});

/**
* 视频速度控制器组件
* 人类可读的速度映射表
*/

const uiCompVideoPlayerController = Vue.extend({
    template: "#ui-comp-template-video-player-controller",
    data: {
        isTheaterMode: false
    },
    props: ['bus'],
    mounted() {
        this.bus.$on('esc-pressed', () => { this.onEscPressed() })
    },
    methods: {
        setVideoPlaybackRate: function (speed) {
            var video_player_control = document.getElementById("video_player");
            var speed_panel_control = document.getElementById("video_player_info_speed");
            video_player_control.playbackRate = speed;
            speed_panel_control.innerText = 'x ' + speed.toFixed(2);
            video_player_control.srclang='zh';
            video_player_control.translate='no';
        },
        toggleTheaterMode: function () {
            var video_player = document.getElementById("video_player")
            video_player.classList.toggle("video_player_theater_mode")
            this.isTheaterMode = !this.isTheaterMode
        },
        onEscPressed: function () {
            if (this.isTheaterMode) {
                this.toggleTheaterMode()
                // window.setTimeout(
                //     function () {
                //         document.getElementById("video_player").focus()
                //     }, 0
                // )
                this.$nextTick(() => {
                    //this.$refs.player.focus()
                    document.getElementById("video_player").focus()
                })
            }
        }
    }
});

/**
 * 远程视频播放器组件，主要是封装了 hls.js 用于支持 m3u8 的直接播放。
 */
const uiCompRemoteVideoPlayer = Vue.extend({
    template: "#ui-comp-template-remote-video-player",
    props: {
        sessionItem: Object,
        bus: Object
    },
    components: {
        "video-player-controller": uiCompVideoPlayerController
    },
    mounted: function () {
        var url = 'vdownload_mp4' in this.sessionItem
            ? this.sessionItem.vdownload_mp4
            : ('vplay_addr' in this.sessionItem
                ? this.sessionItem.vplay_addr
                : this.sessionItem.vdownload);
        url = url.toLowerCase();

        if (Hls.isSupported()) {
            var video_player_control = document.getElementById('video_player');

            //不知道是不是这个绕开了domain
            if (isRemoteMP4Address(url)) {
                //动态设置绕开 cross domain 问题
                video_player_control.src = url;
                video_player_control.style.width = "100%";
            }
            else if (isRemoteM3U8Address(url)) {
                video_player_control.volume = 1.0;
                var hls = new Hls();
                var m3u8Url = decodeURIComponent(url)
                hls.loadSource(m3u8Url);
                hls.attachMedia(video_player_control);
                video_player_control.style.width = "100%";
                video_player_control.translate = true;
                video_player_control.srclang= 'en';
            }
        }
    },
    methods: {
        onEscPressed: function () {
            this.bus.$emit('esc-pressed')
        }
    }
});
