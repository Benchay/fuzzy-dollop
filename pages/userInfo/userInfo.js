const app = getApp();
const tapItemArray = [];
const {http} = require('../../utils/util.js');
const storage = require('../../utils/storage.js');
const constant = require("../../utils/constant.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
      wechatInfo: {},       // 初始化账户信息，包括头像、昵称等
      nabeiInfo:null,
      userPicPath:'../../images/userInfo/user_info_nologin.png',
      allOrders: "",        // 初始化订单数量
      unpaidOrder: "",      // 初始化待付款订单数量
      notReceivedOrder: "", // 初始化待收货订单数量
      discountCard: "",      // 初始化优惠券数量
      messageCount:0    //未读消息数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const _this = this;
    this.setData({nabeiInfo: app.globalData.nabeiInfo });
    app.getWechatInfo(function (userInfo) {
      _this.setData({
          wechatInfo: userInfo
      });
      if (app.globalData.nabeiInfo && userInfo) {
        _this.setData({ userPicPath: userInfo.avatarUrl });
      }
    });
    //console.log('userInfo===onload')
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
     this.setData({ nabeiInfo: app.globalData.nabeiInfo });
    if (app.globalData.nabeiInfo && app.globalData.userInfo) {
      this.setData({ userPicPath: app.globalData.userInfo.avatarUrl });
    }
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

  goBindPage: (e) => {
    var obj = { "url": '../userInfo', "type": 2, "from": ''};
    app.globalData.goUrl = obj;
    wx.navigateTo({
      url: `../userInfo/bind/bind`
    })
  },
  goMyInfo: (e) => {
    //console.log(e.currentTarget.dataset);
    let userinfo = e.currentTarget.dataset.id;
    let picPath = e.currentTarget.dataset.picpath;
    if (userinfo == null){
      var obj = { "url": '../userInfo', "type": 2, "from": '' };
      app.globalData.goUrl = obj;
      wx.navigateTo({
        url: `../userInfo/bind/bind`
      })
      return;
    }
    wx.navigateTo({
      url: `../userInfo/myInfo/myInfo`
    });
  },
  loginOut:function(){
    app.globalData.nabeiInfo=null;
    storage.setStore(constant.NABEI_AUTH_TOKEN, null);
    this.setData({ nabeiInfo:null});
    this.setData({userPicPath: '../../images/userInfo/user_info_nologin.png'});
    //this.onLoad();
  }
})