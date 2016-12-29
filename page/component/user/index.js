var bsurl = require('../../../utils/bsurl.js');
Page({
  data: {
    list: [],
    user: {}
  },

  onLoad: function (options) {
    var id = options.id || '177018'
    var that = this;
    wx.request({
      url: bsurl + 'user/detail?uid=' + id,
      data:{
        cookie: wx.getStorageSync('cookie') || ''
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
        cookie: wx.getStorageSync('cookie') || ''
      },
      success: function (res) {
        that.setData({
          list: res.data.playlist
        });
      }
    });
  }
});
