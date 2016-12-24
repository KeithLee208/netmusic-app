var common = require('../../../utils/util.js');
var bsurl = require('../../../utils/bsurl.js');
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
      title: this.share.title,
      desc: this.share.des,
      path: '/playing/index?id=' + this.share.id + '&br=' + this.share.br
    }
  },
  playmusic: function (that,id, br) {
    that.setData({
        start: 0,
        music: app.globalData.curplay,
        duration: common.formatduration(app.globalData.curplay.dt)
      });
    that.share.title = app.globalData.curplay.name
    wx.setNavigationBarTitle({ title: app.globalData.curplay.name});
    app.seekmusic(1)
    common.loadrec(0, 0, that.data.music.id, function (res) {
        that.setData({
          commentscount: res.total
        })
      })
  },
  loadlrc: function () {
    common.loadlrc(this);
  },
  playother: function (e) {
    var type = e.currentTarget.dataset.other;
    this.setData(defaultdata);
    app.nextplay(type);
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
  onShow: function () {
    var that = this;
    app.globalData.playtype = 1;
    common.playAlrc(that, app);
    seek = setInterval(function () {
      common.playAlrc(that, app);
    }, 1000)
  },
  onUnload: function () {
    clearInterval(seek)
  },
  onHide: function () {
    clearInterval(seek)
  },
  downmusic: function () {
    var url = this.data.music.mp3Url;
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
  onLoad: function (options) {
    var that = this;
    this.setData({
      shuffle: app.globalData.shuffle
    });
    this.share = {
      id: options.id,
      br: options.br
    }
    if (app.globalData.curplay.id != options.id || !app.globalData.curplay.url) {
      //播放不在列表中的单曲
      this.playmusic(that,options.id, options.br);
    } else {
      that.setData({
        start: 0,
        music: app.globalData.curplay,
        duration: common.formatduration(app.globalData.curplay.dt)
      });
      wx.setNavigationBarTitle({ title: app.globalData.curplay.name });
      common.loadrec(0, 0, that.data.music.id, function (res) {
        that.setData({
          commentscount: res.total
        })
      })
    };
    console.log(app.globalData.globalStop, "F playing")
  },
  playingtoggle: function (event) {
    if (this.data.disable) {
      return;
    }
    var that = this
    if (this.data.playing) {
      console.log("暂停播放");
      that.setData({ playing: false });
      app.stopmusic(1);
    } else {
      console.log("继续播放")
      app.seekmusic(1, function () {
        that.setData({
          playing: true
        });
      }, app.globalData.currentPosition);
    }
  }
})