// pages/write/write.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		focus: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options.id)
		if (options.id == undefined ){
			console.log("写文章")
		}else{
			console.log("编辑文章")
		}
	},
	bindFormSubmit: function (e) {
		console.log(e.detail.value.textarea)
	}
})