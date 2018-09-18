var app = getApp();
var Url = app.globalData.globalUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		nodes:"",
		class_name:"未命名分类",
		title:"我是题目",
		user_name:"佚名",
		create_time:"一个月黑风高的日子",
		conmmentCount:0,
		conmmentArr:[]
	},
	onShow: function(){
		wx.showToast({
			title: '加载中',
			icon:"loading",
			duration:10000
		})
		this.getArticle();
		this.getConmment();
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showToast({
			title: '加载中',
			icon: "loading",
			duration: 10000
		})
		var that = this;
		this.getArticle();
		this.getConmment();
	},
	//加载文章
	getArticle: function(){
		var that = this;
		var postsId = app.globalData.articleId;
		console.log(postsId);
		wx.request({
			url: Url + '&do=api_posts&op=get_one_post',
			data: {
				id: postsId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				var tempInfo = res.data.data;
				var tempBlogContent = tempInfo.content;
				tempBlogContent.replace('<img', '<img style="max-width:100%;height:auto" ')
				if (res.data.code == 0) {
					wx.hideToast();
					that.setData({
						class_name: tempInfo.class_name,
						title: tempInfo.title,
						user_name: tempInfo.user_name,
						create_time: toDate(tempInfo.create_time),
						nodes: tempBlogContent
					})
				}
			}
		})
	},
	//加载评论
	getConmment: function(){
		var that = this;
		var postsId = app.globalData.articleId;
		console.log(postsId);
		var userId = app.globalData.uid;
		console.log(userId);
		wx.request({
			url: Url + '&do=api_posts&op=get_reply',
			data: {
				posts_id: postsId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				wx.hideToast();
				console.log(res.data);
				var tempInfo = res.data;
				for(var i = 0;i<tempInfo.data.length;i++){
					//转换日期
					tempInfo.data[i]['create_time'] = toDate(tempInfo.data[i]['create_time']);
					//添加删除
					if (tempInfo.data[i]['user_id'] == userId){
						tempInfo.data[i]['ifYou'] = true;
					}else{
						tempInfo.data[i]['ifYou'] = false;
					}
				}
				that.setData({
					conmmentCount: tempInfo.count,
					conmmentArr: tempInfo.data
				})
			}
		})
	},
	//评论
	conmment: function(){
		var postsId = app.globalData.articleId;
		var userId = app.globalData.uid;
		var userName = app.globalData.username;
		var sid = app.globalData.sid;
		if (sid == "") {
			//其实这个地方应该弹授权框的
			wx.showModal({
				title: '提示',
				content: '您还未登录，请先登录！',
			})
		} else {
			wx.navigateTo({
				url: '../conmment/conmment?posts_id=' + postsId + '&user_id=' + userId + '&user_name=' + userName +'&grade=f',
			})
		}
	},
	//赞
	parse: function(){

	},
	//回复评论
	replyConmment: function(e){
		console.log(e.currentTarget.dataset)
		var parentId = e.currentTarget.dataset.pid;
		var postId = e.currentTarget.dataset.posts_id;
		var uid = e.currentTarget.dataset.uid;
		var user_name = e.currentTarget.dataset.user_name; 
		var sid = app.globalData.sid;
		if (sid == "") {
			//其实这个地方应该弹授权框的
			wx.showModal({
				title: '提示',
				content: '您还未登录，请先登录！',
			})
		} else {
			wx.navigateTo({
				url: '../conmment/conmment?posts_id=' + postId + '&parent_id=' + parentId + '&user_id=' + uid + '&user_name=' + user_name + '&grade=s',
			})
		}
	},
	//回复评论里的赞
	replyParse: function(e){
		console.log(e)
		var sid = app.globalData.sid;
		if (sid == "") {
			//其实这个地方应该弹授权框的
			wx.showModal({
				title: '提示',
				content: '您还未登录，请先登录！',
			})
		} else {
			//这里不知道该怎么赞


			// wx.request({
			// 	url: Url + '&do=api_posts&op=reply_pares&reply_id=1&state=we7sid-' + sid,
			// 	data: {
			// 		reply_id: reply_id,
			// 		posts_id: posts_id
			// 	},
			// 	header: {
			// 		'content-type': 'application/json' // 默认值
			// 	},
			// 	success: function (res) {
			// 		wx.hideToast();
			// 		if (res.data.code == 0) {
			// 			wx.showToast({
			// 				title: '删除成功！',
			// 				icon: "success",
			// 				duration: 1000
			// 			})
			// 			//延时刷新页面
			// 			setTimeout(function () {
			// 				that.getArticle();
			// 				that.getConmment();
			// 			}, 1000)
			// 		} else {
			// 			wx.showToast({
			// 				title: res.data.msg,
			// 				icon: "loading",
			// 				duration: 1000
			// 			})
			// 		}
			// 	}
			// })
		}
	},
	//删除评论
	deleteConmment: function(e){
		var that = this; 
		var sid = app.globalData.sid;
		var reply_id = e.currentTarget.dataset.id;
		var posts_id = e.currentTarget.dataset.posts_id;
		console.log(e.currentTarget.dataset)
		wx.showModal({
			title: '提示',
			content: '确认删除评论吗？',
			success: function(e){
				if(e.confirm == true){
					wx.request({
						url: Url + '&do=api_posts&op=delete_reply&state=we7sid-' + sid,
						data: {
							reply_id: reply_id,
							posts_id: posts_id
						},
						header: {
							'content-type': 'application/json' // 默认值
						},
						success: function (res) {
							wx.hideToast();
							if (res.data.code == 0) {
								wx.showToast({
									title: '删除成功！',
									icon: "success",
									duration: 1000
								})
								//延时刷新页面
								setTimeout(function () {
									that.getArticle();
									that.getConmment();
								}, 1000)
							} else {
								wx.showToast({
									title: res.data.msg,
									icon: "loading",
									duration: 1000
								})
							}
						}
					})
				}
			}
		})
		
	}
})
// 日期格式转换
function toDate(number) {
	var n = number * 1000;
	var date = new Date(n);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return (Y + M + D)
}