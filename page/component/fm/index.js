var common = require('../../../utils/util.js');
var bsurl = require('../../../utils/bsurl.js');
let app = getApp();
let seek = 0;
Page({
    data: {
        music: {},
        playtime: "00:00",
        duration: "00:00",
        percent: 0,
        downloadPercent: 0,
        imgload: false,
        playing: true,
        showlrc: false,
        commentscount: 0,
        lrc: {},
        stared: false
    },
    onLoad: function () {
        var music = app.globalData.list_fm[app.globalData.index_fm];
        app.globalData.playtype = 2;
        var that = this;
        if (music) {
            this.setData({
                music: music,
                duration: common.formatduration(music.duration),
            });
            common.loadrec(app.globalData.cookie, 0, 0, that.data.music.id, function (res) {
                that.setData({
                    commentscount: data.total
                })
            })
        } else {
            app.nextfm();
        }
    },
    onShareAppMessage: function () {
        return {
            title: this.data.music.name,
            desc: this.data.music.artists[0].name,
            path: 'page/component/fm/index'
        }
    },
    loadlrc: function () {
        common.loadlrc(this);
    },
    onShow: function () {
        var that = this;
        if (app.globalData.playtype == 1) {
            app.nextfm();
        };
        common.playAlrc(that, app);
        seek = setInterval(function () {
            common.playAlrc(that, app);
        }, 1000);
    },
    onHide: function () {
        clearInterval(seek)
    },
    songheart: function (e) {
        var that = this;
        var music = this.data.music;
        common.songheart(this, app.globalData.cookie, function (t) {
            if (t == 200) {
                music.starred = !music.starred;
                that.setData({ music: music })
            } else {
                wx.navigateTo({
                    url: '../login/index'
                })
            }
        }, 0, music.starred)
    },
    trash: function () {
        var that = this;
        common.songheart(this, app.globalData.cookie, function (t) {
            if (t == 200) {
                that.nextplay();
            } else {
                wx.navigateTo({
                    url: '../login/index'
                })
            }
        }, 1)
    },
    loadimg: function (e) {
        this.setData({
            imgload: true
        })
    },
    museek: function (e) {
        var nextime = e.detail.value
        var that = this;
        nextime = app.globalData.curplay.duration * nextime / 100000;
        app.globalData.currentPosition = nextime
        app.seekmusic(2, function () {
            that.setData({
                percent: e.detail.value
            })
        }, app.globalData.currentPosition);
    },
    play: function (m) {
        var that = this
        if (this.data.playing) {
            that.setData({ playing: false });
            app.stopmusic(1);
        } else {
            app.seekmusic(2, function () {
                that.setData({
                    playing: true
                });
            }, app.globalData.currentPosition);
        }
    },
    nextplay: function () {
        this.setData({
            lrc: [],
            playtime: '00:00',
            percent: '0',
            playing: false,
            showlrc: false,
            duration: "00:00"
        })
        app.nextfm();
    }
})