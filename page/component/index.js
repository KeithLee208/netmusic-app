Page({
  data: {
    list: [],
    user: {}
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: 'https://n.sqaiyan.com/userplaylists?id=177018',
      success: function (res) {
        that.setData({
          list: res.data.playlist,
          user: res.data.playlist[0].creator
        })
      }
    });
  }
});
