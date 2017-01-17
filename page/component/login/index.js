var bsurl=require('../../../utils/bsurl.js');
Page({
    data: {
        phone: "",
        pwd: ""
    },
    onLoad: function () {

    },
    textinput: function (event) {
        var type = event.currentTarget.dataset.type;
        if (type == 1) {
            this.setData({
                phone: event.detail.value
            })
        } else {
            this.setData({
                pwd: event.detail.value
            })
        }
    },
    login: function () {
        var that = this;
        wx.request({
            url:bsurl+'login',
            data: {
                email: that.data.phone,
                password: that.data.pwd
            },
            success: function (res) {
                console.log(res)
                wx.setStorageSync('cookie', res.data.c);
                wx.setStorageSync('user',res.data.i)
                // wx.redirectTo({
                //     url: '../index'
                // })
               wx.switchTab({
                 url: '../home/index'
               })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    }
})