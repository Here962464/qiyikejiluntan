// pages/editInfo/editInfo.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		avatar:"",
		nickname:"",
		info:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		var sid = app.globalData.sid;
		wx.request({
			url: Url + '&do=api_account&op=userinfo&state=we7sid-' + sid, //仅为示例，并非真实的接口地址
			data: {
				type:'info'
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
				var info = res.data;
				var nickName = "";
				var bio = "";
				// 判断用户名是否为空
				if (info.nickname == "" && info.email == "" && info.mobile != "") {
					nickName = info.mobile;
				} else if (info.nickname == "" && info.mobile == "" && info.email != "") {
					nickName = info.email;
				} else if (info.nickname != "") {
					nickName = info.nickname;
				}

				if (info.bio == ""){
					bio = "什么也没写"
				}else{
					bio = info.bio
				}
				that.setData({
					avatar: info.avatar,
					nickname: nickName,
					info: bio
				})
			}
		})
	},
	//头像上传
	//修改昵称
	//
})