// pages/userInfo/myinfo/myinfo.js
const app = getApp();
const { http } = require('../../../utils/util.js');
const storage = require("../../../utils/storage.js")
const constant = require("../../../utils/constant.js");
const convert = require("../../../utils/convert.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userId:'',
      date: '2016-09-01',
      today: new Date().toLocaleDateString().replace(/\//g, '-'),
      time: '12:01',
      gender: [{ name: ' ', type: 0 },{ name: '女', type: 1 },{ name: '男', type: 2 }],
      index: 0,
      mobile:'',
      picPath:'',
      userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = app.globalData.nabeiInfo.user;

    if(!user.mobile) user.mobile='';
    if (app.globalData.userInfo){
      var picPath = app.globalData.userInfo.avatarUrl;
    }
    else if (!user.picPath || user.picPath.lastIndexOf('undefined') || user.picPath == ''){
      var picPath = '../../../../../images/userInfo/user_info_nologin.png';
    }else{
      var picPath = user.picPath;
    }
    if (user.birthday) {
      options.birthday = convert.timestampToTime(user.birthday, false);
    } else {
      options.birthday = '';
    }
    
    this.setData({
      userId: user.id,
      mobile: user.mobile,
      picPath: picPath,
      date: options.birthday,
      userName: app.globalData.userInfo == null ? user.userName:app.globalData.userInfo.nickName,
      index: app.globalData.nabeiInfo.user.gender
    });
    //console.log(options);
    //console.log('myinfo=======onload');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log('myinfo===onshow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindDateChange: function (e) {
    //console.log(e.detail.value);
    this.setData({
      date: e.detail.value
    });
    http({
      url: "ums/api/saveUser.do",
      data: { id: this.data.userId, birthday: e.detail.value },
      func: (data) => {
        if (data.isSuccess) {
          var newobj = app.globalData.nabeiInfo.user;
          //console.log(newobj);
          newobj.birthday = e.detail.value;
          app.globalData.nabeiInfo.user = newobj;
          storage.setStore(constant.NABEI_AUTH_TOKEN, app.globalData.nabeiInfo);
        }
      }
    });
  },

  bindSexChange: function (e) {
    this.setData({
      index: e.detail.value
    });
    http({
      url: "ums/api/saveUser.do",
      data: { id: this.data.userId, gender: this.data.gender[e.detail.value].type },
      func: (data) => {
        app.globalData.nabeiInfo.user.gender = this.data.gender[e.detail.value].type;
        storage.setStore(constant.NABEI_AUTH_TOKEN, app.globalData.nabeiInfo);
      }
    });
  },

})