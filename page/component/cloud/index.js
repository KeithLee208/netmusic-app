var appInstance = getApp();
var bsurl = require('../../../utils/bsurl.js');
var id2Url = require('../../../utils/base64md5.js');
Page({
  data: {
    list: {},
    offset: 0,
    limit: 20,
    loading:false,
    curplay:-1
  },
  onLoad: function (options) {
    this.getcloud()
  },
  getcloud: function (isadd) {
    var that = this;
    wx.request({
      url: bsurl + 'user/cloud',
      data: {
        offset: that.data.offset,
        limit: that.data.limit,
        cookie: appInstance.globalData.cookie
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        if(isadd){
          that.data.offset+=res.data.data.length
          res.data.data=that.data.list.data.concat(res.data.data)
        }
        else{
          that.data.offset=res.data.data.length
        }
        that.setData({
          loading:true,
          offset:that.data.offset,
          list: res.data
        });
      }
    });
  },
  onPullDownRefresh:function(){
    this.data.offset=0;
    this.getcloud();
  },
  onReachBottom:function(){
    this.data.list.hasMore&&this.getcloud(1);
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