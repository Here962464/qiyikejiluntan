// pages/conmment/conmment.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
			holderColor:"#8a8a8a",
			textHolder:"请输入评论内容",
			grade:"f",
			options:{},
			content:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options.grade)
		this.setData({
			options: options
		})
		var grade = options.grade;
		if (grade == "s"){
			//子评论
			this.setData({
				grade: "s"
			})
		}
	},
	//获取评论内容
	getContent: function(e){
		console.log(e.detail.value)
		var tempContent = e.detail.value;
		if (tempContent == ""){
			this.setData({
				holderColor: "#f16773",
				textHolder: "评论内容不能为空！"
			})
		}else{
			this.setData({
				holderColor: "",
				textHolder: "请输入评论内容",
				content: tempContent
			})
		}
	},
	//评论请求
	sendRequest: function(info){
		var sid = app.globalData.sid;
		wx.request({
			url: Url + '&do=api_posts&op=reply&state=we7sid-' + sid ,
			data: info,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
				if (res.data.code == 0) {
					wx.showToast({
						title: '评论成功！',
						icon:"success",
						duration: 1000
					})
					//延时重定向
					setTimeout(function(){
						wx.navigateBack();
					},1000)
				} else {
					wx.showToast({
						title: res.data.msg,
						icon: "loading",
						duration: 1000
					})
				}
			},
			fail: function (err) {
				console.log(err)
			}
		})
	},
	//提交评论
	submit: function(){
		var that  =this;
		var grade = this.data.grade;
		var options = this.data.options;
		var content = that.data.content;
		if (grade == "f" && content != ""){
			var info = {
				posts_id: options.posts_id,
				user_id: options.user_id,
				user_name: options.user_name,
				content: that.data.content
			}
			console.log(info)
			//发请求
			that.sendRequest(info);
		} else if (grade == "s" && content != ""){
			console.log(options)
			var info = {
				posts_id: options.posts_id,
				user_id: options.user_id,
				user_name: options.user_name,
				content: that.data.content,
				pid: options.parent_id
			}
			console.log(info)
			//发请求
			that.sendRequest(info);
		}
	}
})