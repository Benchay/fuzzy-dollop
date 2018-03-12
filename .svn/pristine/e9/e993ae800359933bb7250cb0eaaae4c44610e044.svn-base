// pages/userInfo/message/message.js
const app = getApp();
const {http} = require('../../../utils/util.js');
const {formatDate} = require('../../../utils/convert.js');
const {readBulletinUser,queryBulletinUserByParams} = require('../../../utils/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nabeiInfo: app.globalData.nabeiInfo,
    example:{
      pageIndex:1,
      pageSize:99,
      userId:''
    },
    messages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nabeiInfo = this.data.nabeiInfo;
    if (nabeiInfo) {
      let example = this.data.example;
      example.userId = nabeiInfo.user.id;
      this.setData({
        example: example
      });
      //查询消息分页列表
      this.queryMessage();
    }
  },

  /**
   * 更新消息为已读
   */
  readMessage(){
    http({
      url: readBulletinUser,
      data: this.data.example,
      func: (data) => {
      }
    });
  },

  /**
   * 查询公告消息
   */
  queryMessage(){
    http({
      url: queryBulletinUserByParams,
      data: this.data.example,
      func: (data) => {
        let messages = data.result.results;
        //先格式化时间
        for(let i in messages) {
          messages[i].createTime = formatDate(messages[i].createTime);
        }
        this.setData({
          messages: messages
        });

        //设置消息为已读
        this.readMessage();
      }
    });
  }


})


