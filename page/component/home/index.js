var toplist = require("../../../utils/toplist.js");
var bsurl = require('../../../utils/bsurl.js');
Page({
    data: {
        rec: {
            idx: 0,
            loading: false,
            banner: [],
            recpl: [],
            recsg: [],
            recmvs: []

        },
        thisday: (new Date()).getDate(),
        playlist: {
            idx: 1, loading: false
        },
        djs: {
            idx: 2, loading: false
        },
        sort: {
            idx: 3, loading: false
        },
        tabidx: 0,

    },
    onLoad: function () {
        var that = this
        var rec = this.data.rec
        wx.request({
            url: bsurl + 'banner',
            data: { cookie: wx.getStorageSync('cookie') || '' },
            success: function (res) {
                rec.banner = res.data.banners;
                that.setData({
                    rec: rec
                })
            }
        });

    },
    switchtab: function (e) {
        var that = this;
        var t = e.currentTarget.dataset.t;
        this.setData({ tabidx: t });
        if (t == 0 && !this.data.rec.loading) {
        }
        if (t == 3 && !this.data.sort.loading) {
            wx.request({
                url: bsurl + 'toplist/detail',
                success: function (res) {
                    res.data.loading = true;
                    res.data.idx = 3;
                    that.setData({
                        sort: res.data
                    })
                },
                fail: function () {
                    // fail
                }
            })
        }
    },
    onShow: function () {
        var that = this;
        var rec = this.data.rec
        if (wx.getStorageSync('cookie') == '') {
           
            wx.redirectTo({
                url: '../login/index'
            });
            return;
        }
        if (!this.data.rec.loading) {
            wx.request({
                url: bsurl + 'recommend/resource',
                data: { cookie: wx.getStorageSync('cookie') || '' },
                success: function (res) {
                    rec.recpl = res.data.recommend;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
        }
    }
})