var toplist = require("../../../utils/toplist.js");
var bsurl = require('../../../utils/bsurl.js');
var app = getApp();
Page({
    data: {
        rec: {
            idx: 0,
            loading: false,
            banner: [4],
            recpl: [6],
            recsg: [6],
            dj: [6],
            recmvs: [4]

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
                url: bsurl + 'personalized',
                data: { cookie:app.globalData.cookie },
                success: function (res) {
                    rec.recpl = res.data.result;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
            wx.request({
                url: bsurl + 'personalized/newsong',
                data: { cookie:app.globalData.cookie },
                success: function (res) {
                    rec.recsg = res.data.result;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
            wx.request({
                url: bsurl + 'personalized/mv',
                data: { cookie:app.globalData.cookie},
                success: function (res) {
                    rec.recmvs = res.data.result;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
            wx.request({
                url: bsurl + 'personalized/djprogram',
                data: { cookie:app.globalData.cookie},
                success: function (res) {
                    rec.dj = res.data.result;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
            wx.request({
                url: bsurl + 'personalized/privatecontent',
                data: { cookie:app.globalData.cookie},
                success: function (res) {
                    rec.privatecontent = res.data.result;
                    rec.loading = true;
                    that.setData({
                        rec: rec
                    })
                }
            })
        }
    }
})