var bsurl = require('../../../utils/bsurl.js');
var appInstance = getApp();
Page({
  data: {
    songs: [],
    curplay: 0,
    loading:false,
    date: ((new Date()).getDate())
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: bsurl + 'recommend/songs',
      data: { cookie: wx.getStorageSync('cookie') || '' },
      success: function (res) {
        that.setData({
          songs: res.data.recommend,
          loading: true
        })
      }
    })
  },
  playall: function (event) {
    this.setplaylist(this.data.songs[0], 0);
    appInstance.seekmusic(1)
  },
  setplaylist: function (music, index) {
    //设置播放列表，设置当前播放音乐，设置当前音乐在列表中位置
    appInstance.globalData.curplay = appInstance.globalData.curplay.id != music.id ? music : appInstance.globalData.curplay;
    appInstance.globalData.index_am = index;
    appInstance.globalData.playtype = 1;
    var shuffle = appInstance.globalData.shuffle;
    appInstance.globalData.list_sf = this.data.songs;//this.data.list.tracks;
    appInstance.shuffleplay(shuffle);
    appInstance.globalData.globalStop = false;
    this.setData({
      curplay: music.id
    })
  },
  playmusic: function (event) {
    var that = this;
    let music = event.currentTarget.dataset.idx;
    let st = event.currentTarget.dataset.st;
    if (st * 1 < 0) {
      wx.showToast({
        title: '歌曲已下架',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    music = this.data.songs[music];
    that.setplaylist(music, event.currentTarget.dataset.idx);
    appInstance.seekmusic(1)
  }
})