var bsurl = require('../../../utils/bsurl.js');
var app=getApp();
Page({
  data: {
    list1: [],
    list2:[],
    user: {},
    loading:true
  },

  onLoad: function (options) {
    var id = options.id
    var that = this;
    wx.request({
      url: bsurl + 'user/detail?uid=' + id,
      data:{
        cookie:app.globalData.cookie
      },
      success: function (res) {
        that.setData({
          user: res.data
        });
        wx.setNavigationBarTitle({
          title: res.data.profile.nickname
        })
      }
    });
    wx.request({
      url: bsurl + 'user/playlist',
      data: {
        uid: id,
        offset: 0,
        limit: 1000,
        cookie:app.globalData.cookie
      },
      success: function (res) {
        var a=res.data.playlist||[]
        that.setData({
          loading:false,
          list1: a.filter(function(item){return item.userId==id}),
          list2: a.filter(function(item){return item.userId!=id})
        });
      }
    });
  }
});
