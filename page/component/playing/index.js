var common = require('../../../utils/util.js');
var bsurl = require('../../../utils/bsurl.js');
var nt = require('../../../utils/nt.js');
let app = getApp();
let seek = 0;
let defaultdata = {
  playing: false,
  music: {},
  playtime: '00:00',
  duration: '00:00',
  percent: 1,
  lrc: [],
  commentscount: 0,
  lrcindex: 0,
  showlrc: false,
  disable: false,
  downloadPercent: 0,
  share: {
    title: "一起来听",
    des: ""
  }
};

Page({
  data: defaultdata,
  onShareAppMessage: function () {
    return {
      title: this.data.share.title,
      desc: this.data.share.des,
      path: 'page/component/home/index?share=1&st=playing&id=' + this.data.share.id + '&br=' + this.data.share.br
    }
  },
  playmusic: function (that, id, br) {
    wx.request({
      url: bsurl + 'music/detail',
      data: {
        id: id
      },
      success: function (res) {
        app.globalData.curplay = res.data.songs[0];
        !app.globalData.list_am.length && (app.globalData.list_am.push(res.data.songs[0]))
        app.globalData.curplay.st = app.globalData.staredlist.indexOf(app.globalData.curplay.id) < 0 ? false : true
        that.setData({
          start: 0,
          share: {
            id: id,
            title: app.globalData.curplay.name,
            br: res.data.privileges[0].maxbr,
            des: (app.globalData.curplay.ar || app.globalData.curplay.artists)[0].name
          },
          music: app.globalData.curplay,
          duration: common.formatduration(app.globalData.curplay.dt || app.globalData.curplay.duration)
        });
        wx.setNavigationBarTitle({ title: app.globalData.curplay.name });
        app.seekmusic(1);
        common.loadrec(app.globalData.cookie, 0, 0, that.data.music.id, function (res) {
          that.setData({
            commentscount: res.total
          })
        })
      }
    })

  },
  loadlrc: function () {
    common.loadlrc(this);
  },
  playother: function (e) {
    var type = e.currentTarget.dataset.other;
    this.setData(defaultdata);
    var that = this;
    app.nextplay(type, function () {
      that.setData({
        share: {
          id: app.globalData.curplay.id,
          title: app.globalData.curplay.name,
          des: (app.globalData.curplay.ar || app.globalData.curplay.artists)[0].name
        }
      })
    });
  },
  playshuffle: function () {
    var shuffle = this.data.shuffle;
    shuffle++;
    shuffle = shuffle > 3 ? 1 : shuffle;
    this.setData({
      shuffle: shuffle
    })
    app.shuffleplay(shuffle);
  },
  songheart: function () {
    var that = this;
    var music = this.data.music;
    common.songheart(this, app.globalData.cookie, function (t) {
      if (t == 200) {
        music.st = !music.st;
        that.setData({ music: music });
        app.likelist();
      } else {
        wx.navigateTo({
          url: '../login/index'
        })
      }
    }, 0, music.st)
  },
  museek: function (e) {
    var nextime = e.detail.value
    var that = this
    nextime = app.globalData.curplay.dt * nextime / 100000;
    app.globalData.currentPosition = nextime
    app.seekmusic(1, function () {
      that.setData({
        percent: e.detail.value
      })
    }, app.globalData.currentPosition);
  },
  onShow: function () {
    var that = this;
    app.globalData.playtype = 1;
    common.playAlrc(that, app);
    seek = setInterval(function () {
      common.playAlrc(that, app);
    }, 1000);
  },
  onUnload: function () {
    clearInterval(seek);
    nt.removeNotification("music_next", this)
  },
  onHide: function () {
    clearInterval(seek)
  },
  downmusic: function () {
    var url = this.data.music.url;
    var that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log("下载成功");
            var saved = wx.getStorageSync('downmusic');
            saved[this.data.music.id] = res.tempFilePath;
            wx.setStorage({
              key: 'downmusic',
              data: saved,
              success: function (res) {
                console.log("保存成功");
              }
            })
          }
        })
      }
    })
  },
  music_next: function () {
    var that = this
    console.log("playing next")
    common.loadrec(app.globalData.cookie, 0, 0, that.data.music.id, function (res) {
      that.setData({
        commentscount: res.total
      })
    })
  },
  onLoad: function (options) {
    var that = this;
    nt.addNotification("music_next", this.music_next, this);
    this.setData({
      shuffle: app.globalData.shuffle
    });
    if (app.globalData.curplay.id != options.id || !app.globalData.curplay.url) {
      //播放不在列表中的单曲
      this.playmusic(that, options.id, options.br);
    } else {
      that.setData({
        start: 0,
        music: app.globalData.curplay,
        duration: common.formatduration(app.globalData.curplay.dt || app.globalData.curplay.duration),
        share: {
          id: app.globalData.curplay.id,
          br: options.br,
          title: app.globalData.curplay.name,
          des: (app.globalData.curplay.ar || app.globalData.curplay.artists)[0].name
        },
      });
      wx.setNavigationBarTitle({ title: app.globalData.curplay.name });
      common.loadrec(app.globalData.cookie, 0, 0, that.data.music.id, function (res) {
        that.setData({
          commentscount: res.total
        })
      })
    };
  },
  playingtoggle: function (event) {
    common.toggleplay(this, app, function () { })
  }
})