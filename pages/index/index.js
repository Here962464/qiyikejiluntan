//index.js
//获取应用实例
const app = getApp();
var Url = app.globalData.globalUrl;
Page({
	data: {
		info:[],
		currentNavtab: "0",
		clientHeight: 0,
		currentTab:"0"
	},
	
	onLoad: function () {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				console.log(res)
				that.setData({
					clientHeight: res.windowHeight
				});
			}
		});
		wx.request({
			url: Url+'&do=api_posts',
			data: {
				op:"display"
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
				var tempInfo = res.data.data;
				if(res.data.code == 0){
					for(var i=0;i<tempInfo.length;i++){
						tempInfo[i]['isSelected']=false;
					}
					that.setData({
						info:tempInfo
					})
				}
			}
		})
	},
	switchTab: function (e) {
		this.setData({
			currentNavtab: e.currentTarget.dataset.idx
		});
	},
	swiperTab: function (e) {
		// console.log(e.target.dataset.current)
		// var that = this;
		// if (this.data.currentTab === e.target.dataset.current) {
		// 	return false;
		// } else {
		// 	that.setData({
		// 		currentTab: e.target.dataset.current
		// 	})
		// }
	},
	lazyLoad: function(){

	},
	toDetail: function(e){
		// console.log(e.currentTarget.id)
		app.globalData.articleId = e.currentTarget.id;
		wx.navigateTo({
			url: '../articleDetail/articleDetail',
		})
	}
})
