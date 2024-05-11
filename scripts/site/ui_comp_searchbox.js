const InvalidPriority = 9999;
const InputDelayMs = 800;

const KeywordTypeIndex = 0;
const KeywordTypeSingl = 1;
const KeywordTypeCombo = 2;

const isConditionYear = function (str) {
    //去掉filter 前边的-
    //然后捕获 gdcxx xx 20xx
    var match = str.match(/^-(?:gdc)?(\d{2,4})$/);
    if (match == null || match.length != 2)
        return null;

    var year = match[1].length == 4 ? match[1].substring(2) : match[1];
    return year in globalSettings.dataSources ? year : null;
}

const isConditionCateogry = function (str) {
    if (str.length == 3 && str[0] == '-') {
        var category = str.substring(1).toLowerCase();
        if (category in globalSettings.categories)
            return category;
    }
    return null
}

const seemsLikeSessionId = function (element) {
    result = element.match(/^[1-9]\d{3}\d*$/);
    return result != null;
}

const splitTextArray = function (text, splitText) {
    var result = text.split(splitText).map(e => e.trim());
    return result.filter(e => e != "");
}

var SearchResult = function () {
    this.years = [];
    this.categories = [];
    this.keywords = [];
};

SearchResult.prototype = {
    addCategory: function (category) {
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        }
    },

    addYear: function (year) {
        if (!this.years.includes(year)) {
            this.years.push(year);
        }
    },

    addKeyword: function (keyword) {
        if (!this.keywords.includes(keyword)) {
            this.keywords.push(keyword);
        }
    }
};


var Keyword = function () {
    this.type = KeywordTypeSingl;
    this.value = '';
    this.split = null;
    this.prior = 0;
};

Keyword.prototype = {
    isValid: function () {
        return this.value.length > 0;
    },

    push: function (text) {
        if (this.type == KeywordTypeSingl && this.value.length > 0) {
            //change type to combo from
            this.type = KeywordTypeCombo;
            this.value = [this.value, text];
        }
        else if (this.type == KeywordTypeCombo) {
            if (text != "" || this.value[this.value.length - 1] != "") {
                this.value.push(text);
            }
            //else ignore whitespace
        }
        else {
            //(this.type == KeywordTypeIndex)
            //ignore whitespace
        }
    },

    fullValue: function () {
        if (Array.isArray(this.value)) {
            return this.value.join(' ');
        }
        else {
            return this.value;
        }
    },

    getSplit: function () {
        if (this.split == null) {
            this.split = [];
            var recomposeKey = "";
            for (const key of this.value) {
                if (key == "" && recomposeKey != "") {
                    this.split.push(recomposeKey);
                    recomposeKey = "";
                } else {
                    if (recomposeKey != "") {
                        recomposeKey += " " + key;
                    } else {
                        recomposeKey += key;
                    }
                }
            }
            if (recomposeKey != "" && this.split.length > 0) {
                this.split.push(recomposeKey);
            } else {
                this.split = this.value;
                this.prior = 2;
            }
        }
        return this.split;
    }
};

const splitSearchText = function (text) {
    if (text == '')
        return [];

    var array = text.split(',');

    var result = new SearchResult();
    var keyword = null;
    for (const segment of array) {
        var splitkeywords = segment.split(' ').map(e => e.trim());
        for (const element of splitkeywords) {
            if (element == "") {
                if (keyword != null) {
                    keyword.push(element);
                }
                //filter first empty token.
                continue;
            }

            var year = isConditionYear(element);
            if (year != null) {
                result.addYear(year);
                if (keyword != null) {
                    result.keywords.push(keyword);
                    keyword = null;
                }
                continue;
            }

            var category = isConditionCateogry(element);
            if (category != null) {
                result.addCategory(category);
                if (keyword != null) {
                    result.keywords.push(keyword);
                    keyword = null;
                }
                continue;
            }

            if (seemsLikeSessionId(element)) {
                if (keyword != null) {
                    result.keywords.push(keyword);
                }
                keyword = new Keyword();
                keyword.type = KeywordTypeIndex;
                keyword.value = element;
                result.keywords.push(keyword);
                keyword = null;
                continue;
            }

            if (keyword == null) {
                keyword = new Keyword();
                keyword.value = element;
            }
            else {
                keyword.push(element)
            }
        }
        if (keyword != null) {
            result.keywords.push(keyword);
            keyword = null;
        }
    }
    return result;
}

const isFilterTokenExist = function (source, token) {
    if (source.search(token) != -1)
        return true;

    //time format -gdc03
    token = token.replace('-gdc', '-');
    if (source.search(token) != -1)
        return true;

    return false;
}

const filterSources = function (years, categories) {

    var result = null;
    if (years.length == 0) {
        years = getDescOrderYears()
    }
    else {
        years = years.sort((a, b) => parseInt(b) - parseInt(a));
    }
    result = years.map(year => globalSettings.dataSources[year]);


    var flat_result = [];
    if (categories.length == 0) {
        var index = 0;
        for (const source of result) {
            for (const category in source) {
                source[category].title = globalSettings.categories[category].full + ' 20' + years[index];
                flat_result.push(source[category]);
            }
            index += 1;
        }
    }
    else {
        var index = 0;
        for (const source of result) {
            for (const category of categories) {
                if (category in source) {
                    source[category].title = globalSettings.categories[category].full + ' 20' + years[index];
                    flat_result.push(source[category]);
                }
            }
            index += 1;
        }

    }
    return flat_result;
}

const filterCategorySources = function (filterCategories, sources) {
    var result = [];

    return result;
}

const isLetter = function (chr) {
    return chr.length == 1 && chr.match(/[a-z]/) != null;
}

const isolated = function (str, strlength, begin, end) {
    var bsplit = begin == 0;
    var esplit = end == strlength - 1;
    var charb = '';
    var chare = '';
    if (!bsplit) {
        charb = str.charAt(begin - 1);
        bsplit = (charb == ' ' || charb == ',');
    }

    if (!esplit) {
        chare = str.charAt(end + 1);
        esplit = (chare == ' ' || chare == ',');
    }

    if (bsplit && esplit) {
        return 0;
    }

    if (isLetter(charb)) {
        return InvalidPriority;
    }

    var wordlength = end - begin + 1;
    if (isLetter(chare)) {
        return (wordlength > 2) ? 2 : InvalidPriority;
    }

    if (charb == chare) {       //如引号包裹起来的，就会是这种情况。不再需要递归了。
        return 0;
    }
    if (bsplit || esplit) {     //像 'Halo ***' / ***,xbox' 这样的就属于 1，但是要避免don't 查询t这样的case
        return (wordlength > 1) ? 1 : InvalidPriority;
    }
    return (wordlength > 1) ? 2 : InvalidPriority;//意料之外的情况，如  something&keyword, @authorname'
}

const tryMatchString = function (source, substring) {
    source = source.toLowerCase();
    substring = substring.toLowerCase();

    if (substring == source) {
        return 0;
    } else if (source.includes(substring)) {
        var begin = source.indexOf(substring);
        var end = begin + substring.length - 1;
        return isolated(source, source.length, begin, end);
    }
    return InvalidPriority;
}

const tryMatchItemAndKeyword = function (item, keywordString) {
    var matchTitle = tryMatchString(item.title, keywordString);
    var matchSpeaker = tryMatchString(item.speaker, keywordString);
    var matchCompany = tryMatchString(item.company, keywordString);
    var matchOverview = tryMatchString(item.overview, keywordString) + 2;
    //overview 的权重会低一些
    return Math.min(matchTitle, matchSpeaker, matchCompany, matchOverview);
}

const tryMatchIdAndKeyword = function (id, subId) {
    if (id == subId) {
        return 0;
    }
    var diff = id.length - subId.length;
    if (diff > 0 && id.includes(subId)) {
        return diff <= 2 ? 1 : 2;
    }
    return InvalidPriority;
}
const tryMatchItemAndKeywords = function (item, keywords) {
    var priorities = [];
    for (const keyword of keywords) {
        if (keyword.type == KeywordTypeIndex) {
            var priority = InvalidPriority;
            if (item.media != 'slider') {
                var prior = tryMatchIdAndKeyword(item.vid, keyword.value);
                if (prior == 0) {
                    return 0;
                } else {
                    priority = Math.min(priority, prior);
                }
            }

            if (item.media != 'video') {
                var prior = tryMatchIdAndKeyword(item.sid, keyword.value);
                if (prior == 0) {
                    return 0;
                } else {
                    priority = Math.min(priority, prior);
                }
            }
            //兼容类似 game 101 的情况
            var prior = tryMatchItemAndKeyword(item, keyword.value);
            priority = Math.min(priority, prior);
            if (priority < InvalidPriority) {
                priorities.push(priority);
            }
            continue;
        }

        if (keyword.type == KeywordTypeSingl) {
            var priority = tryMatchItemAndKeyword(item, keyword.value);
            if (priority < InvalidPriority) {
                priorities.push(priority);
            }
            continue;
        }

        if (keyword.type == KeywordTypeCombo) {
            var priority = tryMatchItemAndKeyword(item, keyword.fullValue());
            //如果完全没找着，有可能是用户想分开查找
            //但是不知道需要用逗号分割关键词。
            //我们试试拆分pair，但是这种情况，会遇到很多拆分的词组
            //所以我们对拆分的结果，主动降低优先级。
            //如果拆分的结果都是0，那么就直接算0
            if (priority == InvalidPriority) {
                var subPriorities = [];
                var splitKeywords = keyword.getSplit();

                for (const splitKeyword of splitKeywords) {
                    var prior = tryMatchItemAndKeyword(item, splitKeyword);
                    if (prior < InvalidPriority) {
                        subPriorities.push(prior + keyword.prior);
                    }
                }
                if (subPriorities.length > 0) {
                    if (subPriorities.length == splitKeywords.length) {
                        matchcount = subPriorities.filter(p => p == 0).length;
                        if (matchcount == splitKeywords.length) {
                            priority = 1;
                        } else {
                            priority = (matchcount > 0) ? 2 : 3;
                        }
                    }
                }
            }

            if (priority < InvalidPriority) {
                priorities.push(priority);
            }
        }
    }

    return priorities.sort((a, b) => a - b);
}

const searchSessionItems = function (sources, keywords) {
    var results = [];
    var sameIdSession = [];
    //要用sources 的排序因为这个跟时间有关。
    //如果用keyword 去搜索，有可能会导致顺序打乱
    for (const source of sources) {
        for (const item of source) {
            var priority = tryMatchItemAndKeywords(item, keywords)

            if (Array.isArray(priority)) {
                if (priority.length > 0) {
                    results.push({ priority: priority, item: item });
                }
            }
            else {
                sameIdSession.push(item);
            }
        }
    }

    sorted = results.sort((a, b) => {
        if (a.priority.length == b.priority.length) {
            for (index = 0; index < a.priority.length; index += 1) {
                if (a.priority[index] < b.priority[index])
                    return -1;
                if (a.priority[index] > b.priority[index]) {
                    return 1;
                }
            }
            return parseInt(b.item.year) - parseInt(a.item.year);
        } else {
            return b.priority.length - a.priority.length;
        }
    });


    var keywordString = ""
    for (const keyword of keywords) {
        if (keywordString != "") {
            keywordString += ',';
        }
        keywordString += keyword.fullValue();
    }

    sortedSessions = sorted.map(element => element.item);
    sortedSessions.title = "search result for: " + keywordString;
    if (sameIdSession.length > 0) {
        sameIdSession.title = "match Id session";
        return [sameIdSession, sortedSessions];
    }
    else {
        return [sortedSessions];
    }
}

const searchContext = {
    comp: null,
    delayTimerId: 0,
    lastSearchText: "",

    createSearchRequest: function (searchText) {
        var _this = this;
        clearTimeout(this.delayTimerId);
        this.delayTimerId = setTimeout(function () {
            _this.submitSearchText(searchText);
        }, InputDelayMs);
    },

    clearResult: function () {
        clearTimeout(this.delayTimerId);
        this.delayTimerId = 0;
        this.lastSearchText = "";
    },

    submitSearchText: function (searchText) {
        searchText = searchText.trim();
        if (searchText != "" && this.lastSearchText != searchText) {
            clearTimeout(this.delayTimerId);
            this.delayTimerId = 0;
            this.doSearch(searchText)
        }
    },

    doSearch: _.debounce(function (searchText) {
        this.lastSearchText = searchText;

        var keywordArray = splitSearchText(searchText);
        var sources = filterSources(keywordArray.years, keywordArray.categories);

        var searchResult = [];
        if (keywordArray.keywords.length > 0) {
            searchResult = searchSessionItems(sources, keywordArray.keywords)
        } else {
            searchResult = sources;
        }
        this.comp.setSearchResult(keywordArray, searchResult);

    }, InputDelayMs)
};

/**
 * 分类视频列表组件
 */
const uiCompSearchBox = Vue.extend({
    template: "#ui-comp-template-searchbox",
    data: function () {
        return {
            showExample: false,
            searchText: "",
            searchKeywords: [],
            searchYears: [],
            searchCategories: [],
        }
    },

    mounted: function () {
        searchContext.comp = this;
    },

    watch: {
        searchText: function () {
            searchContext.createSearchRequest(this.searchText);
        }
    },
    methods: {
        submitSearchText: function () {
            searchContext.submitSearchText(this.searchText);
        },

        showSearchHint: function () {
            return this.searchYears.length > 0
                || this.searchCategories.length > 0
                || this.searchKeywords.length > 0;
        },
        addFilterToken: function (category) {
            if (!isFilterTokenExist(this.searchText, category)) {
                if (this.searchText.length > 0 && !this.searchText.endsWith(' ')) {
                    this.searchText += ' ';
                }
                this.searchText += category + ' ';
            } else {
                this.searchText = this.searchText.replace(category, '').trim();
                if (this.searchText == '') {
                    this.clearSearchText();
                }
            }
            document.getElementById("search_input").focus();
        },

        clearSearchContext: function () {
            this.searchText = "";
            this.searchYears.length = 0;
            this.searchCategories.length = 0;
            this.searchKeywords.length = 0;
            searchContext.clearResult();
        },

        clearSearchText: function () {
            this.clearSearchContext();
            this.$root.clearSearchView();
        },

        setSearchResult: function (searchContext, resultJson) {
            this.searchYears.length = 0;
            this.searchCategories.length = 0;
            this.searchKeywords.length = 0;

            for (const keyword of searchContext.keywords) {
                var keywordString = keyword.type == KeywordTypeCombo
                    ? keyword.value.join(' ') : keyword.value;
                this.searchKeywords.push(keywordString);
            }

            for (const year of searchContext.years) {
                this.searchYears.push('20' + year + '年');
            }

            for (const category of searchContext.categories) {
                this.searchCategories.push(globalSettings.categories[category].pretty);
            }

            this.$root.displaySearchResult(resultJson);
        }
    }
});