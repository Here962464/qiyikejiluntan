// pages/mine/mine.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	
	},
	editInfo: function(){
		wx.navigateTo({
			url: '../editInfo/editInfo'
		})
	},
	toMyList: function(){
		wx.navigateTo({
			url: '../myArticle/myArticle'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.request({
			url: Url + '&do=api_account&op=login', //仅为示例，并非真实的接口地址
			data: {
				username: '18166847162',
				password: '444',
				mode:"mobile"
			},
			header: {
					'content-type': 'application/json' // 默认值
			},
			success: function (res) {
					console.log(res.data)
					app.globalData.sid = res.data.data.session_id;
					app.globalData.uid = res.data.data.account.uid;
					//用户名
				var tempM = res.data.data.account.mobile;
				var tempE = res.data.data.account.email;
				if (tempM != "" && tempE == ""){
					app.globalData.username = tempM;
				} else if (tempM == "" && tempE != ""){
					app.globalData.username = tempE;
				}else{
					app.globalData.username = res.data.data.account.nickname;
				}
					
			}
		})
	}
})