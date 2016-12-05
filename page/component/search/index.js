var typelist = require('../../../utils/searchtypelist.js');
Page({
    data: {
        tab: 1,
        value: "",
        tabs: {},
        recent:[1,2,3],
        loading:false,
        prevalue:""
    },
    onLoad: function (options) {
        this.setData({
            tabs: typelist,
            recent:wx.getStorageSync("recent")||[],
            tab: { tab: typelist[0].type, index: 0 },
        })
    },
    inputext: function (e) {
        var name = e.detail.value;
        console.log(name)
        this.setData({ value: name });
    },
    search: function (e) {
        var name = e.detail.value.name;
        if(!name||(name==this.data.prevalue))return;
        var index = this.data.tab.index;
        var curtab =typelist[index]
        var that = this;
        this.setData({
            tabs: typelist,
            prevalue:name
        })
        this.httpsearch(name,curtab.offset,this.data.tab.tab, function (res) {
            curtab.relist = res;
            curtab.loading=true;
            var tl=typelist;
            tl[index]=curtab;
            var recent=that.data.recent;
            var curname=recent.findIndex(function(e){return e==name});
            console.log(curname)
            if(curname>0){
                recent.splice(curname,1)
            }
            recent.unshift(name);
            console.log(recent)
            wx.setStorageSync('recent',recent)
            that.setData({
                tabs:tl,
                loading:true,
                recent:recent,
                prevalue:name
            })
        })
    },
    loadresult:function(e){
        var data=e.currentTarget.dataset;
        var index=data.index,
            type=data.type
    },
    httpsearch: function (name, offset,type, cb) {
        wx.request({
            url: 'https://n.sqaiyan.com/search',
            data: {
                name: name,
                offset: offset,
                limit: 20,
                type:type
            },
            method: 'GET',
            success: function (res) {
               cb && cb(res.data)
            }
        })
    },
    tabtype: function (e) {
        var index=e.currentTarget.dataset.index;
        var curtab=this.data.tabs[index];
        var type=e.currentTarget.dataset.tab;
        var that=this;
        if(!curtab.loading){
            this.httpsearch(this.data.value,curtab.offset,type, function (res) {
                curtab.relist = res;
                curtab.loading=true;
                var tl=that.data.tabs;
                tl[index]=curtab;
                that.setData({
                    tabs:tl
                })
            })
        }
        this.setData({
            tab:{
                tab:type,
                index:index
            }
        })
    }
})