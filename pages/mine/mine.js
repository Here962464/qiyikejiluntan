// pages/mine/mine.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
      }
    })
  }
})