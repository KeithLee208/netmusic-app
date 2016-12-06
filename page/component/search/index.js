var typelist = require('../../../utils/searchtypelist.js');
Page({
    data: {
        tab: 1,
        value: "",
        tabs: {},
        recent: [1, 2, 3],
        loading: false,
        prevalue: ""
    },
    onLoad: function (options) {
        this.setData({
            tabs: typelist,
            recent: wx.getStorageSync("recent") || [],
            tab: { tab: typelist[0].type, index: 0 },
        })
    },
    inputext: function (e) {
        var name = e.detail.value;
        this.setData({ value: name });
    },
    search: function (name) {
        if (!name || (name == this.data.prevalue)) return;
        var index = this.data.tab.index;
        var curtab = typelist[index]
        var that = this;
        this.setData({
            tabs: typelist,
            prevalue: name,
            value: name
        })
        this.httpsearch(name, curtab.offset, this.data.tab.tab, function (res) {
            curtab.relist = res;
            curtab.loading = true;
            var tl = typelist;
            tl[index] = curtab;
            var recent = that.data.recent;
            var curname = recent.findIndex(function (e) { return e == name });
            if (curname > -1) {
                recent.splice(curname, 1)
            }
            recent.unshift(name);
            wx.setStorageSync('recent', recent)
            that.setData({
                tabs: tl,
                loading: true,
                recent: recent,
                prevalue: name
            })
        })
    },
    searhFrecent: function (e) {
        this.search(e.currentTarget.dataset.value)
    },
    searhFinput: function (e) {
        this.search(e.detail.value.name)
    },
    loadresult: function (e) {
        var data = e.currentTarget.dataset;
        var index = data.index,
            type = data.type
    },
    httpsearch: function (name, offset, type, cb) {
        wx.request({
            url: 'https://n.sqaiyan.com/search',
            data: {
                name: name,
                offset: offset,
                limit: 20,
                type: type
            },
            method: 'GET',
            success: function (res) {
                cb && cb(res.data)
            }
        })
    },
    tabtype: function (e) {
        var index = e.currentTarget.dataset.index;
        var curtab = this.data.tabs[index];
        var type = e.currentTarget.dataset.tab;
        var that = this;
        if (!curtab.loading) {
            this.httpsearch(this.data.value, curtab.offset, type, function (res) {
                curtab.relist = res;
                curtab.loading = true;
                var tl = that.data.tabs;
                tl[index] = curtab;
                that.setData({
                    tabs: tl
                })
            })
        }
        this.setData({
            tab: {
                tab: type,
                index: index
            }
        })
    },
    del_research: function (e) {
        //删除搜索历史
        var index = e.currentTarget.dataset.index;
        this.data.recent.splice(index, 1);
        this.setData({
            recent: this.data.recent
        })
        wx.setStorageSync('recent', this.data.recent)
    }

})