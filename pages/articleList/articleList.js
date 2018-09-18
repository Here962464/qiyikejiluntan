// pages/articleList/articleList.js
var app = getApp();
var Url = app.globalData.globalUrl;
//父分类的id
var parentIdArray = [];
//index
var parentIdIndex = 0;
//数组去重
Array.prototype.distinct = function () {
	var arr = this,
		result = [],
		i,
		j,
		len = arr.length;
	for (i = 0; i < len; i++) {
		for (j = i + 1; j < len; j++) {
			if (arr[i] === arr[j]) {
				j = ++i;
			}
		}
		result.push(arr[i]);
	}
	return result;
}
Page({

  /**
   * 页面的初始数据
   */
  	data: {
		//文章列表
	  	info:[],
		//文章总数
	  	count:0,
		//屏幕高度
	  	curHeight:0,
		//分类列表
		groupLists:[],
		//导航名
		className:"未命名分类",
		//发请求时候的参数 分类ID
		classId:0,
		//当前分类ID
		curClassId:0,
		//请求参数limit1
		start: 0,
		//请求参数limit2
		end:6,
		//底线
		hasBaseLine:false,
		//如果没有文章
		noArticle:true,
		//返回上一级提示文字
		backTo:"",
		copyInfo:[],
		//文章列表
		noList:false
  	},
	onshow: function(){
		this.requestLoad();
	},
  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//清空数组和index  这一步超级重要，如果不清空，不同一级分类之间就会窜子分类
		parentIdArray = [];
		parentIdIndex = 0;

		var that = this;
		//获取到与文章同级下的文章分类了
		console.log(app.globalData.classIdGroup);
		if (app.globalData.classIdGroup.length == 0){
			console.log("没有分类了")
			this.setData({
				noArticle:true
			})
		}else{
			this.setData({
				groupLists: app.globalData.classIdGroup,
				noArticle:false
			})
		}
		this.showtoast();
	  	//获取屏幕高度
	  	wx.getSystemInfo({
		  	success: function (res) {
			  	that.setData({
				  curHeight: res.windowHeight
			  	})
		  	},
	  	})
	  	var className = app.globalData.className;
	  	var classId = app.globalData.classId;
		  this.setData({
			  className:className,
			  classId: classId,
			  backTo: className
		  })
	  	//设置导航条文字
	  	wx.setNavigationBarTitle({
		  title: className
	  	})
		this.requestLoad()
  	},
	//文章详情
	goToDetail: function(event){
		console.log(event);
		//页面传参  存posts_id
		app.globalData.articleId = event.currentTarget.id;
		wx.navigateTo({
			url: '../articleDetail/articleDetail',
		})
	},
	//分类切换
	goToSonClass: function (event) {
		var curClassId = event.currentTarget.id;
		var curClassName = event.currentTarget.dataset.name;
		var parentId = event.currentTarget.dataset.pid;
		//子分类item
		var sonInfo = [];
		console.log(event);
		
		var tempInfo = app.globalData.copyIdGroup;
		for (var i = 0; i < tempInfo.length;i++){
			if (tempInfo[i].parent_id == curClassId){
				sonInfo.push(tempInfo[i])
			}
		}
		console.log(tempInfo)
		console.log(sonInfo)
		if (sonInfo.length == 0){
			console.log("没有列表了 但是可能会有文章")
			parentIdIndex++;
			parentIdArray.push(parentId);
			this.setData({
				classId: curClassId,
				groupLists: [],
				backTo: "返回上一级",
				noList:true
			})
			this.requestLoad()
			//设置导航条文字
			wx.setNavigationBarTitle({
				title: curClassName
			})
		} else {
			this.showtoast(); 
			parentIdIndex++;
			parentIdArray.push(parentId);
			console.log(parentIdArray)
			console.log(parentIdIndex)
			this.setData({
				groupLists: sonInfo,
				backTo: "返回上一级",
				classId: curClassId,
				noList: false
			})
			this.requestLoad()
		}
	},
	//返回上一级
	backTo: function () {
		//数组去重
		// parentIdArray = parentIdArray.distinct(); 
		//清空子分类数组
		var sonInfo = [];
		console.log(app.globalData.className)
		if (parentIdIndex == 1){
			this.setData({
				backTo: app.globalData.className,
				noList: false
			})
		}
		if (parentIdIndex <= 0){
			parentIdIndex = 0;
			var parentClassId = parentIdArray[parentIdIndex];
			var tempInfo = app.globalData.copyIdGroup; 
			this.setData({
				classId: parentClassId,
				noList: false
			})
			this.requestLoad()
		} else {
			this.showtoast();
			parentIdIndex--;
			var parentClassId = parentIdArray[parentIdIndex];
			var tempInfo = app.globalData.copyIdGroup;
			console.log(tempInfo)
			for (var i = 0; i < tempInfo.length; i++) {
				if (tempInfo[i].parent_id == parentClassId) {
					sonInfo.push(tempInfo[i])
				}
			}
			this.setData({
				groupLists: sonInfo,
				classId: parentClassId,
				noList: false
			})
			this.requestLoad()
			console.log(parentClassId)
			console.log(parentIdIndex)
		}
	},
	//按需加载
	lazyLoad: function(){
		var that = this;
		this.setData({
			end: that.data.end + 6
		})
		if (this.data.end < this.data.count + 6) {
			this.showtoast();
			this.setData({
				hasBaseLine: false
			})
			this.requestLoad();
		}else{
			this.setData({
				hasBaseLine:true
			})
		}
		
	},
	//写文章
	gotoWrite: function(){
		var sid = app.globalData.sid;
		console.log(sid)
		if(sid == ""){
			wx.showModal({
				title: '提示',
				content: '您还未登录，请先登录！',
			})
		}else{
			wx.navigateTo({
				url: '../write/write',
			})
		}
	},
	requestLoad: function(){
		var that = this;
		wx.request({
			url: Url + '&do=api_posts&op=display2',
			data: {
				class_id: that.data.classId,
				limit1: that.data.start,
				limit2: that.data.end
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				if (res.data.code == 0) {
					wx.hideToast();
					var tempArray = res.data.data;
					for (var i = 0; i < tempArray.length; i++) {
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
						count: res.data.count
					})
				} else {
					wx.showToast({
						title: "加载失败",
						icon: "loading"
					})
				}

			},
			fail: function () {

			}
		})
	},
	showtoast: function(){
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
