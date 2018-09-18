// pages/myArticle/myArticle.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		info:[],
		end:6,
		curHeight:0,
		count:0,
		hasBaseLine:false,
		noArticle:false,
		OnExamine: "待审核...",
		ExamineErr: "审核未通过!"
	},
	onShow: function(){
		this.showtoast();
		this.requestArticle()
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(app.globalData.sid)
		var that = this;
		//获取屏幕高度
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					curHeight: res.windowHeight
				})
			},
		})
		this.showtoast();
		//首次加载文章
		this.requestArticle()
	},
	//按需加载
	lazyLoad: function(){
		var end = this.data.end;
		//后台返回的是字符串，必须转换，不然出错
		var count = parseInt(this.data.count);
		if (end < count + 6){
			this.setData({
				end: this.data.end + 6
			})
			this.showtoast();
			this.requestArticle()
		}else{
			this.setData({
				hasBaseLine:true
			})
		}
	},
	//文章详情
	goToDetail: function (event) {
		console.log(event);
		//页面传参  存posts_id
		app.globalData.articleId = event.currentTarget.id;
		wx.navigateTo({
			url: '../articleDetail/articleDetail',
		})
	},
	//删除文章
	deleteArticle: function(e){
		var postId = e.currentTarget.id;
		var that = this;
		wx.showModal({
			title: '提示',
			content: '确定要删除文章及文章下的所有评论吗？',
			success: function(e){
				console.log(e)
				if(e.confirm == true){
					wx.request({
						url: Url + '&do=api_posts&op=delete_posts&state=we7sid-' + app.globalData.sid,
						data:{
							posts_id: postId
						},
						header: {
							'content-type': 'application/json' // 默认值
						},
						success: function(res){
							console.log(res.data)
							if(res.data.code == 0){
								wx.showToast({
									title: '删除成功！',
									icon:"success",
									duration: 1000
								})
								//刷新页面数据
								that.requestArticle()
							}else{
								wx.showToast({
									title: res.data.msg,
									icon: "loading",
									duration: 1000
								})
							}
						},
						fail: function(err){
							console.log(err)
						}
					})
				}
			}
		})
	},
	//编辑文章
	edit: function(e){
		var articleId = e.currentTarget.id;
		wx.navigateTo({
			url: '../write/write?id=' + articleId,
		})
	},
	//发表文章
	writeArticle: function(){
		wx.navigateTo({
			url: '../write/write',
		})
	},
	//请求文章列表
	requestArticle: function(){
		var that = this;
		wx.request({
			url: Url + '&do=api_posts&op=get_my_posts&state=we7sid-' + app.globalData.sid,
			data: {
				limit1: 0,
				limit2: that.data.end
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				wx.hideToast();
				console.log(res.data)
				if (res.data.code == 0) {
					//判断有没有文章
					if (res.data.count.count == "0") {
						that.setData({
							noArticle: true
						})
					} else {
						var tempArray = res.data.data;
						for (var i = 0; i < tempArray.length; i++) {
							//判断审核状态
							if (tempArray[i].isshow == 0) {
								// 审核中
								tempArray[i].OnExamine = true;
								tempArray[i].ExamineErr = false;
							} else if (tempArray[i].isshow == 1) {
								// 审核通过
								tempArray[i].OnExamine = false;
								tempArray[i].ExamineErr = false;
							} else if (tempArray[i].isshow == 2) {
								// 审核未通过
								tempArray[i].OnExamine = false;
								tempArray[i].ExamineErr = true;
							}
							// 判断nickName是否为空
							if (tempArray[i].nickname == "") {
								tempArray[i]["userName"] = tempArray[i].user_name
							} else {
								tempArray[i]["userName"] = tempArray[i].nickname
							}
							//时间戳
							tempArray[i].create_time = toDate(tempArray[i].create_time)
						}
						that.setData({
							info: tempArray,
							count: res.data.count.count,
							noArticle: false
						})
					}
				}
			},
			fail: function (err) {
				console.log(err)
			}
		})
	},
	showtoast: function () {
		wx.showToast({
			title: '加载中',
			icon: "loading",
			duration: 10000
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