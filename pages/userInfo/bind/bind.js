const app = getApp();
const commonFun = require('../../../utils/common.js');
const {http} = require("../../../utils/util.js");
const storage = require("../../../utils/storage.js")
const constant = require("../../../utils/constant.js");
var interval = null 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNub:'',
    vervifyCode:'',
    time:'获取验证码',
    currentTime:60,
    disabled:false,
    bntDisabeled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  phoneInput:function(e){
    this.setData({ phoneNub: e.detail.value});
  },
  verifyCodeInput:function(e){
    this.setData({ vervifyCode:e.detail.value});
  },
  getCode: function (e) {
    var phonev = e.currentTarget.dataset.id;
    var suc = commonFun.isMobileNub(phonev,true);
    if(!suc) return;
    var that = this;
    http({
      url: "ums/api/getMobileCode.do",
      method: "GET",
      data: {mobile: phonev },
      func: (data) => {
        if (data.isSuccess) {
          console.log(data);
          var currentTime = that.data.currentTime;
          that.setData({
            time: currentTime + '秒',
            disabled: true,
          })
          interval = setInterval(function () {
            currentTime--;
            if (currentTime <= 1) {
              clearInterval(interval)
              that.setData({
                time: '重新获取',
                currentTime: 60,
                disabled: false
              })
            } else {
              that.setData({
                time: (currentTime - 1) + '秒'
              })
            }
          }, 1000);
        }

      }
    });
  },
  login:function(){
    var that = this;
    var suc = commonFun.isMobileNub(that.data.phoneNub, true);
    if (!suc) return;
    if (that.data.vervifyCode == null || that.data.vervifyCode=='' ){
      commonFun.showToast({ title: '请输入手机号验证码！' });
      return;
    }
    http({
      url:'ums/api/wxAppLogin.do',
      method: "post",
      data: { mobile: that.data.phoneNub, mobileCode: that.data.vervifyCode},
      func: (data) => {
        if (data.isSuccess) {
          var token = data.token;
          var user = data.User;
          var compId = data.compId;
          var newobj = { "user": user, "token": token, "compId": compId, "mobile": that.data.phoneNub };
          app.globalData.nabei = newobj;
          that.goUserInfo();
          storage.setStore(constant.NABEI_AUTH_TOKEN, newobj);
        }else{
          commonFun.showToast({ title: data.errorMsg });
          return;
        }
      }
    });
  },
  goUserInfo() {
    let goUrl = app.globalData.goUrl;
    var type=goUrl.type;
    if(type==0){
    }else if(type==1){
      wx.redirectTo({
        url: goUrl.url,
        fail: function (e) {
          console.log(e);
        }
      })
    }else if(type==2){
      wx.switchTab({
        url: goUrl.url,
        success: function () {
        },
        fail: function (obj) {
          console.log(obj);
        }
      })
    }
  },
})