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
		create_time:"一个月黑风高的日子"
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		console.log(app.globalData.articleId);
		var tempId = app.globalData.articleId;
		wx.request({
			url: Url + '&do=api_posts&op=get_one_post',
			data:{
				id: tempId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				var tempInfo = res.data.data; 
				var tempBlogContent = tempInfo.content;
				tempBlogContent.replace('<img', '<img style="max-width:100%;height:auto" ')
				if(res.data.code == 0){
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