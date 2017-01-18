var appInstance = getApp();
var bsurl = require('../../../utils/bsurl.js');
var id2Url = require('../../../utils/base64md5.js');
Page({
  data: {
    list: [],
    curplay: {},
    pid: 0,
    cover: '',
    loading: true,
    toplist: false,
    user:wx.getStorageSync('user')||{}
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    wx.request({
      url: bsurl + 'playlist/detail',
      data: {
        id: options.pid,
        limit: 1000,
        cookie:appInstance.globalData.cookie
      },
      success: function (res) {
        var canplay = [];
        console.log(res.data)
        for (let i = 0; i < res.data.playlist.tracks.length; i++) {
          if (res.data.privileges[i].st >= 0) {
            canplay.push(res.data.playlist.tracks[i])
          }
        }
        that.setData({
          list: res.data,
          canplay: canplay,
          toplist: (options.from == 'stoplist' ? true : false),
          cover: 'http://p'+Math.floor(1 + Math.random() * 4)+'.music.126.net/' + id2Url.id2Url('' + res.data.playlist.coverImgId) + '/' + res.data.playlist.coverImgId + '.jpg'
        });

        wx.setNavigationBarTitle({
          title: res.data.playlist.name
        })
      }, fail: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  onShow: function () {
    this.setData({
      curplay: appInstance.globalData.curplay.id
    })
  },
  userplaylist: function (e) {
    var userid = e.currentTarget.dataset.userid;
    wx.redirectTo({
      url: '../user/index?id=' + userid
    })
  },
  playall: function (event) {
    this.setplaylist(this.data.canplay[0], 0);
    appInstance.seekmusic(1)

  },
  setplaylist: function (music, index) {
    //设置播放列表，设置当前播放音乐，设置当前音乐在列表中位置
    appInstance.globalData.curplay = appInstance.globalData.curplay.id != music.id ? music : appInstance.globalData.curplay;
    appInstance.globalData.index_am = index;//event.currentTarget.dataset.idx;
    appInstance.globalData.playtype = 1;
    var shuffle = appInstance.globalData.shuffle;
    appInstance.globalData.list_sf = this.data.canplay;//this.data.list.tracks;
    appInstance.shuffleplay(shuffle);
    appInstance.globalData.globalStop = false;
    console.log(appInstance.globalData.globalStop, "F playlist")
    this.setData({
      curplay: music.id
    })
  },
  mv: function (e) {
    var id = e.currentTarget.dataset.mvid;
    wx.navigateTo({
      url: '../mv/index?id=' + id
    })
  },
  playmusic: function (event) {
    var that = this;
    let music = event.currentTarget.dataset.idx;
    let st = event.currentTarget.dataset.st;
    console.log(st)
    if (st * 1 < 0) {
      wx.showToast({
        title: '歌曲已下架',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    music = this.data.list.playlist.tracks[music];
    that.setplaylist(music, event.currentTarget.dataset.idx)
  }
});