var bsurl=require('../../../utils/bsurl.js');
var app=getApp();
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
        var url=/^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/.test(that.data.phone)?"login/cellphone":"login"
        wx.request({
            url:bsurl+url,
            data: {
                email: that.data.phone,
                phone: that.data.phone,
                password: that.data.pwd
            },
            success: function (res) {
                console.log(res)
                wx.setStorageSync('cookie', res.data.c);
                wx.setStorageSync('user',res.data.i)
                app.globalData.cookie=res.data.c
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