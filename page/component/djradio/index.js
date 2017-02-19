var bsurl = require('../../../utils/bsurl.js');
var async = require("../../../utils/async.js")
var app = getApp();
Page({
    data: {
        djradio: {},
        loading: false,
        programs: {},
        base: {
            id: 0,
            offset: 0,
            limit: 20,
            asc: true
        }
    },
    onLoad: function (options) {
        var id = options.id;
        var that = this;
        wx.request({
            url: bsurl + 'dj/detail',
            data: {
                id: id,
                cookie: app.globalData.cookie
            },
            complete: function (res) {
                that.setData({
                    djradio: res.data.djRadio
                })
            }
        });
        this.data.base.id = id
        this.setData({
            base: this.data.base
        })
        this.getprograms(false);
    },
    getprograms: function (isadd) {
        var that = this;
        this.setData({loading:false})
        wx.request({
            url: bsurl + 'dj/program',
            data: {
                id: that.data.base.id,
                offset: that.data.base.offset,
                limit: that.data.base.limit,
                asc: that.data.base.asc
            },
            complete: function (res) {
                if (isadd) {
                    res.data.programs = that.data.programs.programs.concat(res.data.programs);
                }
                that.data.base.offset = (isadd ? that.data.base.offset : 0) + res.data.programs.length
                that.setData({
                    programs: res.data,
                    loading: true,
                    base: that.data.base
                })
            }
        });
    },
    onReachBottom: function () {
        (this.data.programs.more&&this.data.loading)&& this.getprograms(1);
    },
    djradio_sub:function(){
        var sub=this.data.djradio.subed;
    },
    playmusic: function (event) {
        let that = this;
        let music = event.currentTarget.dataset.idx;
        music = this.data.programs.programs[music];
        app.globalData.curplay = music.mainSong
    }
})