// pages/userInfo/message/message.js
const app = getApp();
const {http} = require('../../../utils/util.js');
const {formatDate} = require('../../../utils/convert.js');
const {queryBulletin} = require('../../../utils/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nabeiInfo: app.globalData.nabeiInfo,
    example:{
      pageIndex:1,
      pageSize:99,
      applicationId:5
    },
    messages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  /**
   * 渲染页面
   */
  onShow(){
    let nabeiInfo = this.data.nabeiInfo;
    if (nabeiInfo || true) {
      let example = this.data.example;
      this.setData({
        example: example
      });
      //查询消息分页列表
      this.queryMessage();
    }
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function (e) {
    wx.stopPullDownRefresh();
    this.onShow();
  },

  /**
   * 查询公告消息
   */
  queryMessage(){
    http({
      url: queryBulletin,
      data: this.data.example,
      method:"GET",
      func: (data) => {
        let messages = data.result.data;
        //先格式化时间
        for(let i in messages) {
          messages[i].createTime = formatDate(messages[i].createTime);
        }
        this.setData({
          messages: messages
        });
      }
    });
  }


})


