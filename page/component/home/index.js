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
        thisday:'12',
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
            success: function (res) {
                rec.banner = res.data.banners;
                that.setData({
                    rec: rec
                })
            }
        })
        this.setData({
            thisday:(new Date()).getDate()
        })
        wx.request({
            url: bsurl + 'recommend/resource',
            data: { cookie: wx.getStorageSync('cookie') || '' },
            success: function (res) {
                rec.recpl = res.data.recommend
                that.setData({
                    rec: rec
                })
            }
        })
    },
    switchtab: function (e) {
        var t = e.currentTarget.dataset.t;
        this.setData({ tabidx: t });
        if (t == 0 && !this.data.rec.loading) {
        }
    }
})