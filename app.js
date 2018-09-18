//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
	//服务器地址
    globalUrl:"http://www.vy520.cn/app/index.php?i=2&c=entry&m=gengkuai_BBS",
	//跳转分类详情之后的tabBar信息
	className:"七蚁科技",
	//某个分类Id
	classId:"0",
	//根据某个分类找到该分类下所有子分类
	classIdGroup:[],
	//文章Id
	articleId:0,
	//所有分类
	copyIdGroup:[],
	//sessionId
	sid:"",
	//userId
	uid:"",
	//用户名
	username:"匿名人士"
  }
})