// pages/write/write.js
var app = getApp();
var Url = app.globalData.globalUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		focus: false,
		sid:"",
		//分类数组
		objectArray: [],
		titleHolder:"请输入文章标题",
		titleHolderColor:"",
		contentHolder:"提交的内容通过审核之后才会显示在首页哟，在个人中心里可以查看文章审核状态~",
		contentHolderColor:"",
		defaultClass:"",
		titleMax: 30,
		title: "",
		class_name: "",
		class_id: "",
		content: "",
		user_id: "",
		user_name: "",
		parent_class_id:0,
		writeOrEdit:"op=release&state=we7sid-"
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var sid = app.globalData.sid;
		var uid = app.globalData.uid;
		var username = app.globalData.username;
		this.setData({
			sid: sid,
			user_id: uid,
			user_name: username
		})
		var that = this;
		//获取文章分类
		this.requestClassify();
		if (options.id == undefined ){
			console.log("写文章")
			this.setData({
				writeOrEdit: "write"
			})
		}else{
			var postId = options.id
			this.setData({
				posts_id: options.id
			});
			wx.request({
				url: Url + '&do=api_posts&op=get_one_post',
				data: {
					id: postId
				},
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					console.log(res.data)
					if (res.data.code == 0) {
						//缺少一个正则匹配，图片解析，思路是，先正则匹配一遍content的内容，如果匹配到了img标签就替换字符串为
						//<ritch-text nodes="+ 匹配到的字符串 +"></ritch-text>
						//取默认分类
						var tempInfo = res.data.data;
						that.setData({
							title: tempInfo.title,
							class_name: tempInfo.class_name,
							class_id: tempInfo.class_id,
							content: tempInfo.content,
							user_id: tempInfo.user_id,
							user_name: tempInfo.user_name,
							writeOrEdit: "edit"
						})
						console.log(tempInfo.class_name)
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
			console.log("编辑文章")
		}
	},
	chooseClassify: function(e){
		console.log(e)
		var tempArr = this.data.objectArray;
		var index = e.detail.value[0]
		console.log(tempArr[index])
		var tempInfo = tempArr[index];
		this.setData({
			class_id: tempInfo.class_id,
			parent_class_id: tempInfo.parent_class_id
		})
	},
	bindFormSubmit: function (e) {
		var that = this;
		var title = this.data.title;
		var content = this.data.content;
		var writeOrEdit = this.data.writeOrEdit;
		if (title != "" && content != ""){
			wx.showModal({
				title: '提示',
				content: '确定发表文章吗？',
				success: function (e) {
					var op = "op=release";
					var sid = that.data.sid;
					console.log(sid);
					if (e.confirm) {
						var info = {
							title: that.data.title,
							class_id:that.data.class_id,
							parent_class_id: that.data.parent_class_id,
							user_id:that.data.user_id,
							user_name:that.data.user_name,
							content:that.data.content
						}
						if (writeOrEdit == "write") {
							wx.request({
								url: Url + '&do=api_posts&op=release&state=we7sid-' + sid,
								data: info,
								header: {
									'content-type': 'application/json' // 默认值
								},
								success: function (res) {
									console.log(res.data)
									if (res.data.code == 0) {
										wx.showToast({
											title: '发布成功！',
											icon: "success",
											duration: 1000
										})
										//延时重定向
										setTimeout(function () {
											wx.navigateBack();
										}, 1000)
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
						} else if (writeOrEdit == "edit") {							
							info.posts_id = that.data.posts_id;
							wx.request({
								url: Url + '&do=api_posts&op=edit&state=we7sid-' + sid,
								data: info,
								header: {
									'content-type': 'application/json' // 默认值
								},
								success: function (res) {
									console.log(res.data)
									if (res.data.code == 0) {
										wx.showToast({
											title: '修改成功！',
											icon: "success",
											duration: 1000
										})
										//延时重定向
										setTimeout(function () {
											wx.navigateBack();
										}, 1000)
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
						}
						console.log(op)
						
					}
				}
			})
		}
	},
	requestClassify: function(){
		var that = this;
		var sid = app.globalData.sid;
		wx.request({
			url: Url + '&do=api_posts&op=class&state=we7sid-' + sid,
			data: {},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
				var tempArray = [];
				var anotherArray = [];
				var arr = res.data.data;
				if (res.data.code == 0) {
					var treeArr = [];
					function tree(arr, pid, level) {
						for (var i = 0; i < arr.length; i++) {
							if (arr[i].parent_id == pid) {
								arr[i].level = level;
								treeArr.push(arr[i]);
								tree(arr, arr[i].id, level + 1);
							}
						}
					}
					tree(arr, 0, 0);
					for (var i = 0; i < treeArr.length; i++) {
						var tmpStr = "";
						for (var j = 0; j < treeArr[i].level; j++) {
							tmpStr += "　";
						}
						var tempId = parseInt(treeArr[i].id);
						var tempPid = parseInt(treeArr[i].parent_id);
						var txt2 = {
							class_id: tempId,
							parent_class_id: tempPid,
							name: tmpStr + treeArr[i].name
						}
						anotherArray.push(txt2)
					}
					console.log(anotherArray)
					that.setData({
						objectArray: anotherArray
					})
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
	getContent: function(e){
		console.log(e.detail.value)
		var tempContent = e.detail.value;
		this.setData({
			content: tempContent
		})
		if (tempContent == "") {
			this.setData({
				contentHolder: "正文内容不能为空！",
				contentHolderColor: "#f16773"
			})
		}
	},
	mentionContent: function(){
		this.setData({
			contentHolder: "提交的内容通过审核之后才会显示在首页哟，在个人中心里可以查看文章审核状态~",
			contentHolderColor: ""
		})
	},
	getTitle: function(e){
		console.log(e.detail.value)
		var tempTitle = e.detail.value;
		this.setData({
			title: tempTitle
		})
		if (tempTitle == "") {
			this.setData({
				titleHolder: "文章标题不能为空！",
				titleHolderStyle:"mentioncolor"
			})
		}
	},
	mentionTitle: function(e){
		if(e.detail.value == ""){
			this.setData({
				titleHolderStyle: ""
			})
		}
	}
})