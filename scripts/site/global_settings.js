const globalSettings = {

    dataSources: {
        "24": datasource_2024,
        "23": datasource_2023,
        "22": datasource_2022,
        "21": datasource_2021,
        "20": datasource_2020,
        "19": datasource_2019,
        "18": datasource_2018,
        "17": datasource_2017,
        "16": datasource_2016,
        "15": datasource_2015,
        "14": datasource_2014,
        "13": datasource_2013,
        "12": datasource_2012,
        "11": datasource_2011,
        "10": datasource_2010,
        "09": datasource_2009,
        "08": datasource_2008,
        "07": datasource_2007,
        "06": datasource_2006,
        "05": datasource_2005,
        "04": datasource_2004,
        "03": datasource_2003,
    },


    localResources: local_resources,

    categories: {
        "pg": { short: 'pg', pretty: "Program", full: "Programming" },
        "va": { short: 'va', pretty: "Visual Art", full: "Visual Arts" },
        "de": { short: 'de', pretty: "Design", full: "Game Design" },
        "mo": { short: 'mo', pretty: "Mobile", full: 'Mobile Games' },
        "na": { short: 'na', pretty: "Narrative", full: 'Game Narrative' },
        "ai": { short: 'ai', pretty: "AI & ML", full: 'AI & Machine Learning' },
        "pr": { short: 'pr', pretty: "Production", full: 'Production & Team Management' },
        "ol": { short: 'ol', pretty: "Online", full: 'Online Games' },
        "bm": { short: 'bm', pretty: "Business", full: 'Business, Marketing & Management' },
        "au": { short: 'au', pretty: "Audio", full: 'Audio' },
        "xg": { short: 'xg', pretty: "Indie", full: 'Independent Games' },
        "ux": { short: 'ux', pretty: "User Exp", full: 'User Experience' },
        "un": { short: 'un', pretty: "Uncategories", full: 'Uncategories' }
    },

    current: {
        year: '24',
        category: 'pg'
    }
};


const getShortYear = function (year) {
    return year.substring(2);
}

const getSessionItemId = function (item) {
    if (item.media == 'both' || item.media == 'video')
        return item.vid
    else if (item.media == 'slider')
        return item.sid
    return 'xxx'
};

const composeSessionListUrl = function (year, category) {
    return '/' + year + '/' + category + '/'
};

const composeSessionItemUrl = function (item) {
    return "/" + getShortYear(item.year) + "/" + item.shortcat + "/" + getSessionItemId(item) + "/";
};

const isRemoteMP4Address = function (url) {
    //rom origin 'null' has been blocke
    return url.endsWith(".mp4") && url.search("s3-2u-d.digitallyspeaking.com") == -1;
};

const isRemoteM3U8Address = function (url) {
    return url.endsWith(".m3u8");
};

const getDescOrderYears = function () {
    keys = Object.keys(globalSettings.dataSources);
    keys.sort((a, b) => parseInt(b) - parseInt(a));
    return keys;
}

const getRemoteVideoURL = function (sessionItem) {
    if (sessionItem.media != 'slider') {
        const videoAddress = 'vdownload_mp4' in sessionItem
            ? sessionItem.vdownload_mp4
            : sessionItem.vdownload;
        if (videoAddress != '') {
            if (isRemoteMP4Address(videoAddress) || isRemoteM3U8Address(videoAddress)) {
                return videoAddress;
            }
        }
    }
    return '';
};

//重写这个函数，使用本地ppt。
const getLocalSliderPath = function (sessionItem) {
    var sessionId = getSessionItemId(sessionItem);
    if (sessionId in globalSettings.localResources) {
        return globalSettings.localResources[sessionId].slider_url;
    }
    return '';
}



/**
 * 重写这个函数，使用本地视频。
 * 如果返回""，视频播放控件会出错
 */
const getLocalVideoURL = function (sessionItem) {
    var sessionId = getSessionItemId(sessionItem);
    if (sessionId in globalSettings.localResources) {
        return globalSettings.localResources[sessionId].video_url;
    }
    return '';
};

/**
 * 重写这个函数，使用本地字幕。
 * 如果返回""则不会有字幕出现
 */
const getLocalSubtitlesURL = function (sessionItem) {
    var sessionId = getSessionItemId(sessionItem);
    if (sessionId in globalSettings.localResources) {
        return globalSettings.localResources[sessionId].subtitle;
    }
    return '';
}