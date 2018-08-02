// pages/find/find.js
var app = getApp();
var Url = app.globalData.globalUrl;

var parentIdArray = [];
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
	  info:[],
	  copyInfo:[],
	  infoSon:[],
	  parenId:[],
	  backToMention:"全部分类",
	  curIndex:0
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
	  wx.request({
		url: Url +'&do=api_posts&op=class', //仅为示例，并非真实的接口地址
        data: {
           
        },
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: function (res) {
            	console.log(res.data.data);
				if(res.data.code == 0){
					wx.hideToast();
					var tempInfo = res.data.data;
					var array = [];
					var arraySon = [];
					for (var i = 0; i < tempInfo.length; i++) {
						// 一级分类
						if (tempInfo[i].parent_id == 0) {
							array.push(tempInfo[i]);
						} else if (tempInfo[i].parent_id != 0) {
							// 所有子分类
							arraySon.push(tempInfo[i]);
						}
					}
					that.setData({
						info: array,
						copyInfo: res.data.data,
						infoSon: arraySon
					})
					console.log(that.data.info)
					console.log(that.data.copyInfo)
					app.globalData.copyIdGroup = tempInfo;
				}else{
					wx.showToast({
						title: "加载失败",
						icon: "loading"
					})
				}
            }
        });
    },
	toSon: function(event){
		console.log(event)
		wx.navigateTo({
			url: '../articleList/articleList',
		})
		app.globalData.classId = event.currentTarget.id;
		app.globalData.className = event.currentTarget.dataset.name;
		var tempInfoArray = this.data.copyInfo;
		var tempArray = [];
		var parentId = event.currentTarget.id;
		console.log(tempInfoArray)
		console.log(parentId)
		for (var i = 0; i < tempInfoArray.length;i++){
			if (tempInfoArray[i].parent_id == parentId){
				tempArray.push(tempInfoArray[i]);
			}
		}
		app.globalData.classIdGroup = tempArray;
		// console.log(event.currentTarget.dataset.name);
		// console.log(event.currentTarget.id);
		// //数组去重
		// parentIdArray = parentIdArray.distinct();
		// //显示返回上一级
		// this.setData({
		// 	backToMention:"返回上一级"
		// })
		// console.log(event);
		// var tempAarry = this.data.infoSon;
		// console.log(tempAarry)
		// var curArray = [];
		// // 获取分类id
		// var curIndex = event.currentTarget.id;
		// // 获取父分类id
		// var parentId = event.currentTarget.dataset.pid;
		// parentIdArray.push(parentId);
		// parentIdIndex++;
		// console.log(parentIdArray);
		// console.log(parentIdIndex);
		// // 分类名称
		// var className = event.currentTarget.dataset.name;
		// console.log(curIndex);
		// // 循环所有子分类
		// for (var i = 0; i < tempAarry.length; i++){
		// 	if (tempAarry[i].parent_id == curIndex){
		// 		curArray.push(tempAarry[i]);
		// 	}
		// }
		// console.log(curArray)
		// if (curArray == ""){
		// 	//这个时候要把parentId数组里面的最后一个删除，并且index--，否则的话再次返回帖子分类点击返回上一级就必须要点击两次
		// 	parentIdArray.pop();
		// 	parentIdIndex--;

		// app.globalData.className = className;
		// app.globalData.classId = curIndex;
		// 	wx.navigateTo({
		// 		url: '../articleList/articleList',
		// 	})
		// }else{
		// 	this.setData({
		// 		info: curArray,
		// 		parentId: parentId
		// 	})
		// }
	},
	backTo: function(){
		// //数组去重
		// parentIdArray = parentIdArray.distinct();
		// console.log(parentIdArray);
		// console.log(parentIdIndex);
		// parentIdIndex --;
		// //所有非一级数组
		// var infoSon = this.data.infoSon;
		// //父id
		// var pid = parentIdArray[parentIdIndex];
		// //备份的一级数组
		// var copyInfo = this.data.copyInfo;

		// var tempArray = [];

		// if(pid == undefined){
		// 	//说明当前是一级
		// }else if(pid == 0){
		// 	//当前是二级，要返回一级，清空id数组和下标
		// 	parentIdArray = [];
		// 	parentIdIndex = 0;
		// 	this.setData({
		// 		info: copyInfo,
		// 		backToMention: "全部分类"
		// 	})
		// }else{
		// 	//否则就循环所有二级数组，显示与父id相同的
		// 	for (var i = 0; i < infoSon.length; i++){
		// 		if (infoSon[i].parent_id == pid){
		// 			tempArray.push(infoSon[i])
		// 		}
		// 	}
		// 	//更新数组
		// 	this.setData({
		// 		info: tempArray
		// 	})
		// }
		// console.log(copyInfo)
		// console.log(pid)
		// console.log(infoSon);
		
	},
	//打开窗口的时候
	onShow(){
		// console.log(parentIdArray)
		// if (parentIdArray.length == 0){
		// 	this.setData({
		// 		backToMention: "全部分类"
		// 	})
		// }else{

		// }
	}
})