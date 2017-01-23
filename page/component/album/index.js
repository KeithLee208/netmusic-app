var appInstance = getApp();
var bsurl=require('../../../utils/bsurl.js');
var common = require('../../../utils/util.js');
Page({
  data: {
    result:{},
    curplay:0,
    loading: true,
    share: {
    title: "一起来听",
    des: ""
  }
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: bsurl+'album/detail', 
      data:{
        id:options.pid,
        cookie:appInstance.globalData.cookie
      },
      success: function (res) {
        var re=res.data;
        re.album.publishTime=common.formatTime(re.album.publishTime,3);
        var canplay=[];
        for(let i = 0; i < res.data.songs.length;i++){
          var r=res.data.songs[i]
          if(r.privilege.st>-1){
            canplay.push(r)
          }
        }
        that.setData({
          result:res.data,
          loading:false,
          canplay:canplay,
          share:{
            id:options.id,
            title:res.data.album.name+'-'+res.data.album.artist.name,
            des:res.data.album.description
          }
        });
        wx.setNavigationBarTitle({
          title: res.data.album.name
        })
      }, fail: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
   onShareAppMessage: function () {
     if(this.data.share.id)return;
    return {
      title: this.data.share.title,
      desc: this.data.share.des,
      path: 'page/component/playing/index?id=' + this.data.share.id
    }
  },
  onShow: function () {
    this.setData({
      curplay: appInstance.globalData.curplay.id
    })
  },
  artlist:function(e){
    var userid=e.currentTarget.dataset.userid;
    wx.redirectTo({
      url: '../artist/index?id='+userid
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