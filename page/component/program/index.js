var common = require('../../../utils/util.js');
var bsurl = require('../../../utils/bsurl.js');
var app = getApp();
var seek = 0;
var defaultdata = {
	playing: false,
	music: {},
	playtime: '00:00',
	duration: '00:00',
	percent: 1,
	lrc: [],
	commentscount: 0,
	lrcindex: 0,
	disable: false,
	downloadPercent: 0,
	share: {
		title: "一起来听",
		des: ""
	},
	p: {}
};

Page({
	data: defaultdata,
	onShareAppMessage: function () {
		return {
			title: this.data.share.title,
			desc: this.data.share.des,
			path: 'page/component/program/index?id=' + this.data.share.id + '&br=' + this.data.share.br
		}
	},
	playmusic: function (that, id, br) {
		wx.request({
			url: bsurl + 'program/detail',
			data: {
				id: id,
				cookie: app.globalData.cookie
			},
			success: function (res) {
				if (res.data.code != 200) {
					wx.showToast({
						title: '获取电台节目失败,请重试！',
						icon: 'success',
						duration: 2000
					});
					return;
				}
				res = res.data.program
				app.globalData.curplay = res.mainSong;
				!app.globalData.list_dj.length && (app.globalData.list_dj.push(res.mainSong));
				that.setData({
					p: res,
					share: {
						id: id,
						title: res.name,
						des: res.description
					},
					music: app.globalData.curplay,
					duration: common.formatduration(app.globalData.curplay.duration)
				});
				wx.setNavigationBarTitle({ title: app.globalData.curplay.name });
				app.seekmusic(1);
				common.loadrec(app.globalData.cookie, 0, 0, res.id, function (res) {
					that.setData({
						commentscount: res.total
					})
				}, 3)
			}
		})

	},
	toggleinfo:function(){
		this.setData({
			showlrc:!this.data.showlrc
		})
	},
	playother: function (e) {
		var type = e.currentTarget.dataset.other;
		this.setData(defaultdata);
		var that = this;
		app.nextplay(type, function () {
			that.setData({
				share: {
					id: app.globalData.curplay.id,
					title: app.globalData.curplay.name
				}
			})
		});
	},
	playshuffle: function () {
		var shuffle = this.data.shuffle;
		shuffle++;
		shuffle = shuffle > 3 ? 1 : shuffle;
		this.setData({
			shuffle: shuffle
		})
		app.shuffleplay(shuffle);
	},
	songheart: function () {
		var that = this;
		var music = this.data.music;
		common.songheart(this, app.globalData.cookie, function (t) {
			if (t == 200) {
				music.st = !music.st;
				that.setData({ music: music });
				app.likelist();
			} else {
				wx.navigateTo({
					url: '../login/index'
				})
			}
		}, 0, music.st)
	},
	museek: function (e) {
		var nextime = e.detail.value
		var that = this
		nextime = app.globalData.curplay.dt * nextime / 100000;
		app.globalData.currentPosition = nextime
		app.seekmusic(1, function () {
			that.setData({
				percent: e.detail.value
			})
		}, app.globalData.currentPosition);
	},
	onShow: function () {
		console.log("playing show ---------------")
		var that = this;
		app.globalData.playtype = 1;
		common.playAlrc(that, app);
		seek = setInterval(function () {
			common.playAlrc(that, app);
		}, 1000);
	},
	onUnload: function () {
		clearInterval(seek)
	},
	onHide: function () {
		clearInterval(seek)
	},
	onLoad: function (options) {
		var that = this;
		this.setData({
			shuffle: app.globalData.shuffle
		});
		if (app.globalData.curplay.id != options.id) {
			//播放不在列表中的单曲
			this.playmusic(that, options.id);
		} else {
			that.setData({
				start: 0,
				music: app.globalData.curplay,
				duration: common.formatduration(app.globalData.curplay.duration),
				share: {
					id: app.globalData.curplay.id,
					title: app.globalData.curplay.name
				},
			});
			wx.setNavigationBarTitle({ title: app.globalData.curplay.name });
			common.loadrec(app.globalData.cookie, 0, 0, that.data.music.id, function (res) {
				that.setData({
					commentscount: res.total
				})
			}, 3)
		};
	},
	playingtoggle: function (event) {
		if (this.data.disable) {
			return;
		}
		var that = this
		if (this.data.playing) {
			console.log("暂停播放");
			that.setData({ playing: false });
			app.stopmusic(1);
		} else {
			console.log("继续播放")
			app.seekmusic(1, function () {
				that.setData({
					playing: true
				});
			}, app.globalData.currentPosition);
		}
	}
})